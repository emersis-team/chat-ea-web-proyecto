import { CallHelper } from "../helpers/CallHelper";
import { EventsWebRtc } from "../types/WebRtcConnection";
import { io } from "socket.io-client";
import { Device, types } from "mediasoup-client";

const promise = function(socket: any) {
	return function request(type: any, data = {}) {
		return new Promise((resolve) => {
			socket.emit(type, data, resolve);
		});
	}
};

interface Stream {
	video?: types.Consumer;
	audio?: types.Consumer;
	screen?: types.Consumer;
}

interface StreamConsumers {
  [k: string]: Stream;
}

interface TrackMedia {
	video: MediaStreamTrack,
	audio: MediaStreamTrack
}

export class PeerConnection {
	username: string;
	roomName: string;

	device: Device | undefined;
	room: any;
	localVideoStream: MediaStream | undefined;

	transportConsumerData?: any;
	transportConsumer?: any;

	transportProducerData?: any;
	transportProducer?: types.Transport;

	camProducer?: types.Producer;
	micProducer?: types.Producer;
	screenVideoProducer?: types.Producer;
	screenAudioProducer?: types.Producer;

	constructor(roomName: string, username: string) {
		this.username = username;
		this.roomName = roomName;

		this.room = io(`https://38.109.228.250:8080?room=${roomName}&client=${username}`);
		this.room.request = promise(this.room);

		this.room.on("connect", async () => { 
			const RtpCapabilities = await this.room.request("getRouterRtpCapabilities");
			this.device = new Device();
			await this.device.load({ routerRtpCapabilities: RtpCapabilities });
			await this.join();
		});

		this.room.on("new", async () => {
			await this.initPeers();
		});

		this.room.on("removePeer", ({ usernames }: any) => {
			console.log(usernames);
			usernames.forEach((u: string) => CallHelper.removeSource(u));
		});
	}

	/*
		* Un `Producer` es el objeto para emitir video/audio a otros
	*/
	async join() {
		if(!this.device)
			throw new Error("device not initialized");


		this.transportProducerData = await this.room.request("createProducerTransport", {
			rtpcapabilities: this.device.rtpCapabilities
		});
		this.transportProducer = this.device.createSendTransport(this.transportProducerData);

		if(!this.transportProducer)
			throw new Error();

		this.transportProducer.on("connect", async ({ dtlsParameters }: any, resolve: any, reject: any) => {
			const data = await this.room.request("connectProducerTransport", { transportId: this.transportProducer?.id, dtlsParameters });
			resolve(data);
		});

		this.transportProducer.on("produce", async ({ kind, rtpParameters }: any, resolve: any, _reject: any) => {
			const data = await this.room.request("produce", { transportId: this.transportProducer?.id, kind, rtpParameters });
			resolve(data);
		});

		const videoAudioTrack = await this.produceVideoAudio();

		this.transportProducer.appData.ss = true;
		this.camProducer = await this.transportProducer.produce({ track: videoAudioTrack.video });
		this.micProducer = await this.transportProducer.produce({ track: videoAudioTrack.audio });

		await this.initPeers();
	}

	async produceVideoAudio(): Promise<TrackMedia> {
		this.localVideoStream = await CallHelper.loadLocalVideo();
		return {
	 	 video: this.localVideoStream.getVideoTracks()[0],
		 audio: this.localVideoStream.getAudioTracks()[0]
		};
	}

	/*
		* Carga los videos remotos
	*/
	async initPeers() {
		if(!this.device)
			return

		this.transportConsumerData = await this.room.request("createConsumerTransport");
		this.transportConsumer = this.device.createRecvTransport(this.transportConsumerData);

		this.transportConsumer.on("connect", async ({ dtlsParameters }: any, resolve: any, _reject: any) => {
			const data = await this.room.request("connectConsumerTransport", { transportId: this.transportConsumer.id, dtlsParameters })
			resolve(data);
		});

		this.transportConsumer.on("connectionstatechange", async (state: string) => {
			switch(state) {
				case "connected": 
					const streams = await remoteStream;
					if(streams)
						Object.keys(streams).map((username: string) => CallHelper.loadRemoteVideo(username, streams[username]));
				break;

				case "failed":
					this.transportConsumer.close();
					console.error("error");
					location.reload();
				break;
				default:
				break;
			}
		});

		const remoteStream = this.consumeAllRoom();
	}

	private async consumeAllRoom() : Promise<StreamConsumers|undefined> {
		if(!this.device)
			return;

		const { rtpCapabilities } = this.device;
		const { id: transportId } = this.transportConsumer;
		const consumers: [] = await this.room.request("consume", { roomName: this.roomName, transportId, rtpCapabilities });
		const streams: StreamConsumers = {};

		console.log(consumers);
		await Promise.all(consumers.map(async ({ id, producerId, kind, rtpParameters, name }) => {
			if(name === this.username)
				return;
			const kindConsume = kind === "screen" ? "video" : kind;
			const consumer = await this.transportConsumer.consume({ id, producerId, kind: kindConsume, rtpParameters });

			if(!streams[name])
				streams[name] = { video: undefined, audio: undefined };

			if(kind === "video")
				streams[name].video = consumer;
			else if(kind === "audio")
				streams[name].audio = consumer;
			else if(kind === "screen")
				streams[name].screen = consumer;
		}));

		return streams;
	}

	async shareScreen() {
		if(!this.transportProducer)
			return;

		const screenShare = await CallHelper.loadLocalScreen();
		this.screenVideoProducer = await this.transportProducer.produce({ track: screenShare.getVideoTracks()[0] });
	}

	async stopShare() {
		if(!this.transportProducer)
			return;

		await this.room.request("close", {
			kind: "screen",
			username: this.username,
			producerTransportId: this.transportProducer.id,
			consumerTransportId: this.transportConsumer.id
		});

		this.screenVideoProducer?.close();
	}

	async disconnect() {
		if(!this.transportProducer)
			return;

		await this.room.request("close", {
			username: this.username,
			producerTransportId: this.transportProducer.id,
			consumerTransportId: this.transportConsumer.id
		});

		if(this.transportConsumer)
			this.transportConsumer.close();

		this.transportProducer.close();
	}

	async stateMic(state: boolean) {
		if(!state) {
		  console.log("pause the mic");
			this.micProducer?.pause();
			await this.room.request("pauseAudio", this.username);
		} else {
			this.micProducer?.resume();
			await this.room.request("resumeAudio", this.username);
		}
	}

	async stateCamera(state: boolean) {
		if(!state) {
		  console.log("pause the camara");
			this.camProducer?.pause();
			await this.room.request("pauseVideo", this.username);
		} else {
			this.camProducer?.resume();
			await this.room.request("resumeVideo", this.username);
		}
	}
}


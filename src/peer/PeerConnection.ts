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

export class PeerConnection {
	username: string;

	device: Device | undefined;
	room: any;
	localVideoStream: MediaStream | undefined;

	transportConsumerData?: any;
	transportConsumer?: any;

	transportProducerData?: any;
	transportProducer?: any;

	constructor(roomName: string, username: string) {
		this.username = username;
		this.room = io(`http://localhost:5000?room=${roomName}&client=${username}`);
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

		this.room.on("removePeer", ({ username }: any) => {
			console.log("leaving room "+username);
			CallHelper.removeSource(username);
		});
	}

	/*
		* Un `Producer` es el objeto para emitir video/audio a otros
	*/
	async join() {
		if(!this.device)
			throw new Error("device not initialized");

		if(!this.transportProducerData)
			this.transportProducerData = await this.room.request("createProducerTransport", {
				rtpcapabilities: this.device.rtpCapabilities
			});

		if(!this.transportProducer)
			this.transportProducer = this.device.createSendTransport(this.transportProducerData);

		this.transportProducer.on("connect", async ({ dtlsParameters }: any, resolve: any, reject: any) => {
			const data = await this.room.request("connectProducerTransport", { transportId: this.transportProducer.id, dtlsParameters });
			resolve(data);
		});

		this.transportProducer.on("produce", async ({ kind, rtpParameters }: any, resolve: any, _reject: any) => {
			const data = await this.room.request("produce", { transportId: this.transportProducer.id, kind, rtpParameters });
			resolve(data);
		});

		this.localVideoStream = await CallHelper.loadLocalVideo();
		const videoTrack = this.localVideoStream.getVideoTracks()[0];

		await this.transportProducer.produce({ track: videoTrack });
		await this.initPeers();
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
					console.log(state);
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
					console.log(state);
				break;
			}
		});

		const remoteStream = this.consumeAllRoom();
	}

	private async consumeAllRoom() : Promise<Record<string, MediaStream>|undefined> {
		if(!this.device)
			return;

		const { rtpCapabilities } = this.device;
		const { id: transportId } = this.transportConsumer;
		const consumers: [] = await this.room.request("consume", { transportId, rtpCapabilities });
		const streams: Record<string, MediaStream> = {};

		await Promise.all(consumers.map(async ({ id, producerId, kind, rtpParameters, name }) => {
			if(name === this.username)
				return;

			const consumer = await this.transportConsumer.consume({ id, producerId, kind, rtpParameters });
			const stream = new MediaStream();
			stream.addTrack(consumer.track);
			streams[name] = stream;
		}));

		console.log(consumers, Object.keys(streams));

		return streams;
	}

	async disconnect() {
		await this.room.request("close", {
			username: this.username,
			producerTransportId: this.transportProducer.id,
			consumerTransportId: this.transportConsumer.id
		});

		if(this.transportConsumer)
			this.transportConsumer.close();
		if(this.transportProducer)
			this.transportProducer.close();
	}
}


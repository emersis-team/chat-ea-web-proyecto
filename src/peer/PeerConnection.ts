import { CallHelper } from "../helpers/CallHelper";
import { io } from "socket.io-client";
import { Device } from "mediasoup-client";
import { TransportProducer } from "./TransportProducer";
import { TransportConsumer } from "./TransportConsumer";
import {
	EventsWebRtc,
	TransportWebRtc,
	TrackMedia,
	Kinds
} from "../types/WebRtcConnection";

const promise = function(socket: any) {
	return function request(type: any, data = {}) {
		return new Promise((resolve) => {
			socket.emit(type, data, resolve);
		});
	}
};

export class PeerConnection {
	username: string;
	roomName: string;

	device: Device | undefined;
	room: any;
	localVideoStream: MediaStream | undefined;

	transportConsumer?: TransportConsumer;
	transportProducer?: TransportProducer;

	constructor(roomName: string, username: string) {
		this.username = username;
		this.roomName = roomName;

		this.room = io(`https://38.109.228.250:8080?room=${roomName}&client=${username}`);
		//this.room = io(`http://localhost:5000?room=${roomName}&client=${username}`);
		this.room.request = promise(this.room);

		this.room.on(EventsWebRtc.connect, async () => { 
			const RtpCapabilities = await this.room.request(TransportWebRtc.rtpCapabilities);
			this.device = new Device();
			await this.device.load({ routerRtpCapabilities: RtpCapabilities });
			await this.join();
		});

		this.room.on(EventsWebRtc.new, async () => {
			await this.initPeers();
		});

		this.room.on(EventsWebRtc.removePeer, ({ usernames }: any) => {
			console.log(usernames);
			usernames.forEach((u: string) => CallHelper.removeSource(u));
		});
	}

	async join() {
		if(!this.device)
			throw new Error("device not initialized");

		const transportProducerData = await this.room.request(
			TransportWebRtc.createProducer,
			{ rtpcapabilities: this.device.rtpCapabilities }
		);
		this.transportProducer = new TransportProducer(this.device);
		this.transportProducer.producer(transportProducerData, this.room);

		const videoAudioTrack = await this.produceVideoAudio();
		await this.transportProducer.sendVideo(videoAudioTrack);

		await this.initPeers();
	}

	async produceVideoAudio(): Promise<TrackMedia> {
		this.localVideoStream = await CallHelper.loadLocalVideo();
		return {
	 	 video: this.localVideoStream.getVideoTracks()[0],
		 audio: this.localVideoStream.getAudioTracks()[0]
		};
	}

	async initPeers() {
		if(!this.device)
			return

		const transportConsumerData = await this.room.request(TransportWebRtc.createConsumer);

		if(!this.transportConsumer)
			this.transportConsumer = new TransportConsumer(this.device, this.roomName, this.username);

		this.transportConsumer.consume(transportConsumerData, this.room);
	}

	async shareScreen() {
		const screenShare = await CallHelper.loadLocalScreen();
		console.log("video")
		await this.transportProducer?.sendScreen(screenShare);
		console.log("send")
	}

	async stopShare() {
		await this.room.request(TransportWebRtc.close, {
			kind: Kinds.screen,
			username: this.username,
			producerTransportId: this.transportProducer?.getTransportProducerId(),
			consumerTransportId: this.transportConsumer?.getTransportConsumerId()
		});

		this.transportProducer?.stopScreen();
	}

	async disconnect() {
		if(!this.transportProducer)
			return;

		await this.room.request(TransportWebRtc.close, {
			username: this.username,
			producerTransportId: this.transportProducer?.getTransportProducerId(),
			consumerTransportId: this.transportConsumer?.getTransportConsumerId()
		});

		this.transportConsumer?.stopConsume();
		this.transportProducer?.stopProduce();
	}

	async stateMic(state: boolean) {
		if(!state) {
			this.transportProducer?.pauseMic();
			await this.room.request(TransportWebRtc.pauseAudio, this.username);
		} else {
			this.transportProducer?.resumeMic();
			await this.room.request(TransportWebRtc.resumeAudio, this.username);
		}
	}

	async stateCamera(state: boolean) {
		if(!state) {
			this.transportProducer?.pauseCam();
			await this.room.request(TransportWebRtc.pauseVideo, this.username);
		} else {
			this.transportProducer?.resumeCam();
			await this.room.request(TransportWebRtc.resumeVideo, this.username);
		}
	}
}


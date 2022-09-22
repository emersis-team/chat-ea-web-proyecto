import { types } from "mediasoup-client";
import {
	TransportWebRtc,
	TrackMedia
} from "../types/WebRtcConnection";

export class TransportProducer {
	device: types.Device;
	transportProducer?: types.Transport;
	screenProducer?: types.Producer;
	micProducer?: types.Producer;
	camProducer?: types.Producer;

	constructor(device: types.Device) {
		this.device = device;
	}

	producer(transportData: types.TransportOptions, room: any) {
		this.transportProducer = this.device.createSendTransport(transportData);

		if(!this.transportProducer)
			throw new Error();

		this.transportProducer.on(TransportWebRtc.connect,
			async (
				{ dtlsParameters }: any,
				resolve: any,
				_reject: any
			) => {
				const data = await room.request(
					TransportWebRtc.connectProducer,
					{ transportId: this.transportProducer?.id, dtlsParameters }
				);
				resolve(data);
			}
		);

		this.transportProducer.on(TransportWebRtc.produce,
			async (
				{ kind, rtpParameters }: any,
				resolve: (data: any) => void,
				_reject 
			) => {
				const data = await room.request(
					TransportWebRtc.produce,
					{ transportId: this.transportProducer?.id, kind, rtpParameters }
				);
				resolve(data);
			}
		);
	}

  getTransportProducerId() {
		return this.transportProducer?.id;
	}

	async sendScreen(screenShare: MediaStream) {
		if(!this.transportProducer)
			return;

		this.screenProducer = await this.transportProducer.produce({
			track: screenShare.getVideoTracks()[0],
			encodings: [
				{ maxBitrate: 100000 },
				{ maxBitrate: 300000 },
				{ maxBitrate: 900000 }
			],
			codecOptions: { videoGoogleStartBitrate: 1000 },
		});
	}

	stopScreen() {
		this.screenProducer?.close();
	}

	async sendVideo(videoAudioTrack: TrackMedia) {
		if(!this.transportProducer)
			return;

		this.camProducer = await this.transportProducer.produce({
			track: videoAudioTrack.video
		});
		this.micProducer = await this.transportProducer.produce({
			track: videoAudioTrack.audio
		});
	}

	pauseCam() {
		this.camProducer?.pause();
	}

	resumeCam() {
		this.camProducer?.resume();
	}

	pauseMic() {
		this.micProducer?.pause();
	}

	resumeMic() {
		this.micProducer?.resume();
	}

	stopProduce() {
		this.transportProducer?.close();
	}
}


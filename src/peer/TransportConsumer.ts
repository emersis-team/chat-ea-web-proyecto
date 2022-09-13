import { CallHelper } from "../helpers/CallHelper";
import { types } from "mediasoup-client";
import {
	TransportWebRtc,
	StreamConsumers,
	Kinds
} from "../types/WebRtcConnection";

export class TransportConsumer {
	device: types.Device;
	roomName: string;
	username: string;
	transportConsumer?: types.Transport;

	constructor(device: types.Device, room: string, username: string) {
		this.device = device;
		this.roomName = room;
		this.username = username;
	}

	consume(transportData: types.TransportOptions, room: any) {
		this.transportConsumer = this.device.createRecvTransport(transportData);
		console.log("updating peers");

		this.transportConsumer.on(TransportWebRtc.connect,
			async (
				{ dtlsParameters }: any,
				resolve: any,
				_reject
			) => {
				const data = await room.request(
					TransportWebRtc.connectConsumer,
					{ transportId: this.transportConsumer?.id, dtlsParameters }
				)
				resolve(data);
			}
		);

		this.transportConsumer.on(TransportWebRtc.connectionState, async (state: string) => {
			switch(state) {
				case "connected": 
					const streams = await remoteStream;
					if(streams)
						Object.keys(streams).map(
							(username: string) => CallHelper.loadRemoteVideo(username, streams[username])
						);
					break;

				case "failed":
					this.transportConsumer?.close();
					console.error("error");
					location.reload();
				break;
				default: break;
			}
		});

		const remoteStream = this.consumeAllRoom(room);
	}

	private async consumeAllRoom(room: any) : Promise<StreamConsumers|undefined> {
		if(!this.device || !this.transportConsumer)
			return;

		const { rtpCapabilities } = this.device;
		const { id: transportId } = this.transportConsumer;
		const streams: StreamConsumers = {};

		const consumers: [] = await room.request(
			TransportWebRtc.consume,
			{ roomName: this.roomName, transportId, rtpCapabilities }
		);

		console.log(consumers);

		await Promise.all(
			consumers.map(async ({ id, producerId, kind, rtpParameters, name }) => {
				if(name === this.username)
					return;

				if(!streams[name])
					streams[name] = { video: undefined, audio: undefined, screen: undefined };

				const consumer = await this.transportConsumer?.consume({
					id,
					producerId,
					kind: kind === Kinds.screen ? Kinds.video : kind,
					rtpParameters
				});

				switch(kind) {
					case Kinds.video: streams[name].video = consumer; break;
					case Kinds.audio: streams[name].audio = consumer; break;
					case Kinds.screen: streams[name].screen = consumer; break;
				}
			})
		);

		return streams;
	}
	
	getTransportConsumerId() {
		return this.transportConsumer?.id;
	}

	stopConsume() {
		this.transportConsumer?.close();
	}
}


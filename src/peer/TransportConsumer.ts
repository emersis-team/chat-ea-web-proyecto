import { CallHelper } from "../helpers/CallHelper";
import { types } from "mediasoup-client";
import {
	TransportWebRtc,
	StreamConsumers,
	Kinds
} from "../types/WebRtcConnection";

let producersIds: Set<string> = new Set();

export class TransportConsumer {
	device: types.Device;
	roomName: string;
	username: string;
	consumingUsers: Array<string> = [];
	transportConsumer?: types.Transport;
	usernameByProducerId: Record<string, string> = {};

	constructor(device: types.Device, room: string, username: string) {
		this.device = device;
		this.roomName = room;
		this.username = username;
	}

	consume(transportData: types.TransportOptions, room: any) {

		this.transportConsumer = this.device.createRecvTransport(transportData);

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

				case "failed":
					console.error("error");
					this.transportConsumer?.restartIce({ iceParameters: transportData.iceParameters });
				break;
				default: break;
			}
		});
	}

	public async consumeAllRoom(room: any) : Promise<void> {
		console.log("updating peers");

		if(!this.device || !this.transportConsumer)
			throw new Error("no device or transport consumer created");

		const { rtpCapabilities } = this.device;
		const { id: transportId } = this.transportConsumer;
		const streams: StreamConsumers = {};

		const consumers: [] = await room.request(
			TransportWebRtc.consume,
			{ roomName: this.roomName, transportId, rtpCapabilities }
		);

		const wasConsumed = (id: string) => {
			if(producersIds.has(id))
				return true;
			producersIds.add(id);
			return false;
		};

		await Promise.all(
			consumers.map(async ({ id, producerId, kind, rtpParameters, name }) => {
				if(name === this.username)
					return;

				if(kind !== Kinds.screen && wasConsumed(producerId))
					return;

				if(!streams[name])
					streams[name] = {};

				this.usernameByProducerId[name] = producerId

				const consumer = await this.transportConsumer?.consume({
					id,
					producerId,
					kind: kind === Kinds.screen ? Kinds.video : kind,
					rtpParameters
				});

				consumer?.on('transportclose', () => {
					producersIds.delete(consumer.id);
				});

				switch(kind) {
					case Kinds.video: streams[name].video = consumer?.track; break;
					case Kinds.audio: streams[name].audio = consumer?.track; break;
					case Kinds.screen: streams[name].screen = consumer?.track; break;
				}
			})
		);

		Object.keys(streams).map(
			(username: string) => CallHelper.loadRemoteVideo(username, streams[username])
		);
	}

	
	getTransportConsumerId() {
		return this.transportConsumer?.id;
	}

	stopConsume() {
		this.transportConsumer?.close();
		producersIds.clear();
	}

	leaveProducer(username: string) {
		const producerId = this.usernameByProducerId[username];
		if(producersIds.has(producerId))
			producersIds.delete(producerId);
	}
}


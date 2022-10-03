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
	streams: any /*StreamConsumers*/ = {};
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

		if(!this.device || !this.transportConsumer)
			throw new Error("no device or transport consumer created");

		const { rtpCapabilities } = this.device;
		const { id: transportId } = this.transportConsumer;

		const consumers: [] = await room.request(
			TransportWebRtc.consume,
			{ roomName: this.roomName, transportId, rtpCapabilities }
		);

		console.log("updating peers", consumers);

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

				if(!this.streams[name])
					this.streams[name] = {};

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

				this.streams[name].consumer = consumer;

				switch(kind) {
					case Kinds.video: this.streams[name].video = consumer?.track; break;
					case Kinds.audio: this.streams[name].audio = consumer?.track; break;
					case Kinds.screen: this.streams[name].screen = consumer?.track; break;
				}
			})
		);

		Object.keys(this.streams).map(
			(username: string) => CallHelper.loadRemoteVideo(username, this.streams[username])
		);
	}

	getTransportConsumerId() {
		return this.transportConsumer?.id;
	}

	stopConsume() {
		this.transportConsumer?.close();
		producersIds.clear();
	}

	pauseBlackConsumer(username: string) {
		if(this.streams[username] && this.streams[username].video)
			this.streams[username].video.enabled = false;
	}

	resumeBlackConsumer(username: string) {
		if(this.streams[username] && this.streams[username].video)
			this.streams[username].video.enabled = true;
	}

	leaveProducer(username: string) {
		const producerId = this.usernameByProducerId[username];

		if(producersIds.has(producerId))
			producersIds.delete(producerId);
	}
}


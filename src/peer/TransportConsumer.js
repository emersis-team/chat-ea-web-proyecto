import { __awaiter } from "tslib";
import { CallHelper } from "../helpers/CallHelper";
import { TransportWebRtc, Kinds } from "../types/WebRtcConnection";
let producersIds = new Set();
export class TransportConsumer {
    constructor(device, room, username) {
        this.streams = {};
        this.consumingUsers = [];
        this.usernameByProducerId = {};
        this.device = device;
        this.roomName = room;
        this.username = username;
    }
    consume(transportData, room) {
        this.transportConsumer = this.device.createRecvTransport(transportData);
        this.transportConsumer.on(TransportWebRtc.connect, ({ dtlsParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield room.request(TransportWebRtc.connectConsumer, { transportId: (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.id, dtlsParameters });
            resolve(data);
        }));
        this.transportConsumer.on(TransportWebRtc.connectionState, (state) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            switch (state) {
                case "failed":
                    console.error("error");
                    (_b = this.transportConsumer) === null || _b === void 0 ? void 0 : _b.restartIce({ iceParameters: transportData.iceParameters });
                    break;
                default: break;
            }
        }));
    }
    consumeAllRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device || !this.transportConsumer)
                throw new Error("no device or transport consumer created");
            const { rtpCapabilities } = this.device;
            const { id: transportId } = this.transportConsumer;
            const consumers = yield room.request(TransportWebRtc.consume, { roomName: this.roomName, transportId, rtpCapabilities });
            console.log("updating peers", consumers);
            const wasConsumed = (id) => {
                if (producersIds.has(id))
                    return true;
                producersIds.add(id);
                return false;
            };
            yield Promise.all(consumers.map(({ id, producerId, kind, rtpParameters, name }) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (name === this.username)
                    return;
                if (kind !== Kinds.screen && wasConsumed(producerId))
                    return;
                if (!this.streams[name])
                    this.streams[name] = {};
                this.usernameByProducerId[name] = producerId;
                const consumer = yield ((_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.consume({
                    id,
                    producerId,
                    kind: kind === Kinds.screen ? Kinds.video : kind,
                    rtpParameters
                }));
                consumer === null || consumer === void 0 ? void 0 : consumer.on('transportclose', () => {
                    producersIds.delete(consumer.id);
                });
                this.streams[name].consumer = consumer;
                switch (kind) {
                    case Kinds.video:
                        this.streams[name].video = consumer === null || consumer === void 0 ? void 0 : consumer.track;
                        break;
                    case Kinds.audio:
                        this.streams[name].audio = consumer === null || consumer === void 0 ? void 0 : consumer.track;
                        break;
                    case Kinds.screen:
                        this.streams[name].screen = consumer === null || consumer === void 0 ? void 0 : consumer.track;
                        break;
                }
            })));
            Object.keys(this.streams).map((username) => CallHelper.loadRemoteVideo(username, this.streams[username]));
        });
    }
    getTransportConsumerId() {
        var _a;
        return (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.id;
    }
    stopConsume() {
        var _a;
        (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.close();
        producersIds.clear();
    }
    pauseBlackConsumer(username) {
        if (this.streams[username] && this.streams[username].video)
            this.streams[username].video.enabled = false;
    }
    resumeBlackConsumer(username) {
        if (this.streams[username] && this.streams[username].video)
            this.streams[username].video.enabled = true;
    }
    leaveProducer(username) {
        const producerId = this.usernameByProducerId[username];
        if (producersIds.has(producerId))
            producersIds.delete(producerId);
    }
}
//# sourceMappingURL=TransportConsumer.js.map
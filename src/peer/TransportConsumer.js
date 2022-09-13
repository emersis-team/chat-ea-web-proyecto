import { __awaiter } from "tslib";
import { CallHelper } from "../helpers/CallHelper";
import { TransportWebRtc, Kinds } from "../types/WebRtcConnection";
export class TransportConsumer {
    constructor(device, room, username) {
        this.device = device;
        this.roomName = room;
        this.username = username;
    }
    consume(transportData, room) {
        this.transportConsumer = this.device.createRecvTransport(transportData);
        console.log("updating peers");
        this.transportConsumer.on(TransportWebRtc.connect, ({ dtlsParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield room.request(TransportWebRtc.connectConsumer, { transportId: (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.id, dtlsParameters });
            resolve(data);
        }));
        this.transportConsumer.on(TransportWebRtc.connectionState, (state) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            switch (state) {
                case "connected":
                    const streams = yield remoteStream;
                    if (streams)
                        Object.keys(streams).map((username) => CallHelper.loadRemoteVideo(username, streams[username]));
                    break;
                case "failed":
                    (_b = this.transportConsumer) === null || _b === void 0 ? void 0 : _b.close();
                    console.error("error");
                    location.reload();
                    break;
                default: break;
            }
        }));
        const remoteStream = this.consumeAllRoom(room);
    }
    consumeAllRoom(room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device || !this.transportConsumer)
                return;
            const { rtpCapabilities } = this.device;
            const { id: transportId } = this.transportConsumer;
            const streams = {};
            const consumers = yield room.request(TransportWebRtc.consume, { roomName: this.roomName, transportId, rtpCapabilities });
            console.log(consumers);
            yield Promise.all(consumers.map(({ id, producerId, kind, rtpParameters, name }) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (name === this.username)
                    return;
                if (!streams[name])
                    streams[name] = { video: undefined, audio: undefined, screen: undefined };
                const consumer = yield ((_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.consume({
                    id,
                    producerId,
                    kind: kind === Kinds.screen ? Kinds.video : kind,
                    rtpParameters
                }));
                switch (kind) {
                    case Kinds.video:
                        streams[name].video = consumer;
                        break;
                    case Kinds.audio:
                        streams[name].audio = consumer;
                        break;
                    case Kinds.screen:
                        streams[name].screen = consumer;
                        break;
                }
            })));
            return streams;
        });
    }
    getTransportConsumerId() {
        var _a;
        return (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.id;
    }
    stopConsume() {
        var _a;
        (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.close();
    }
}
//# sourceMappingURL=TransportConsumer.js.map
import { __awaiter } from "tslib";
import { CallHelper } from "../helpers/CallHelper";
import { io } from "socket.io-client";
import { Device } from "mediasoup-client";
import { TransportProducer } from "./TransportProducer";
import { TransportConsumer } from "./TransportConsumer";
import { EventsWebRtc, TransportWebRtc, Kinds } from "../types/WebRtcConnection";
const promise = function (socket) {
    return function request(type, data = {}) {
        return new Promise((resolve) => {
            socket.emit(type, data, resolve);
        });
    };
};
export class PeerConnection {
    constructor(roomName, username, hostname) {
        this.username = username;
        this.roomName = roomName;
        this.room = io(`${hostname}?room=${roomName}&client=${username}`);
        this.room.request = promise(this.room);
        this.room.on(EventsWebRtc.connect, () => __awaiter(this, void 0, void 0, function* () {
            const RtpCapabilities = yield this.room.request(TransportWebRtc.rtpCapabilities);
            this.device = new Device();
            yield this.device.load({ routerRtpCapabilities: RtpCapabilities });
            yield this.join();
        }));
        this.room.on(EventsWebRtc.new, () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.consumeAllRoom(this.room));
        }));
        this.room.on(EventsWebRtc.removePeer, ({ usernames }) => {
            usernames.forEach((u) => {
                var _a;
                CallHelper.removeSource(u);
                (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.leaveProducer(u);
            });
        });
        this.room.on(EventsWebRtc.pauseVideo, ({ username }) => {
            var _a;
            (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.pauseBlackConsumer(username);
        });
        this.room.on(EventsWebRtc.resumeVideo, ({ username }) => {
            var _a;
            (_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.resumeBlackConsumer(username);
        });
    }
    join() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device)
                throw new Error("device not initialized");
            const transportProducerData = yield this.room.request(TransportWebRtc.createProducer, { rtpcapabilities: this.device.rtpCapabilities });
            this.transportProducer = new TransportProducer(this.device, this.room);
            this.transportProducer.producer(transportProducerData);
            const videoAudioTrack = yield this.produceVideoAudio();
            yield this.transportProducer.sendVideo(videoAudioTrack);
            yield this.initPeers();
            yield ((_a = this.transportConsumer) === null || _a === void 0 ? void 0 : _a.consumeAllRoom(this.room));
        });
    }
    produceVideoAudio() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const localVideoStream = yield CallHelper.loadLocalVideo();
            return {
                video: (_a = localVideoStream.getVideoTracks()[0]) !== null && _a !== void 0 ? _a : null,
                audio: (_b = localVideoStream.getAudioTracks()[0]) !== null && _b !== void 0 ? _b : null
            };
        });
    }
    initPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device)
                return;
            const transportConsumerData = yield this.room.request(TransportWebRtc.createConsumer);
            if (!this.transportConsumer)
                this.transportConsumer = new TransportConsumer(this.device, this.roomName, this.username);
            this.transportConsumer.consume(transportConsumerData, this.room);
        });
    }
    shareScreen() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const screenShare = yield CallHelper.loadLocalScreen();
            yield ((_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.sendScreen(screenShare));
        });
    }
    stopShare() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.room.request(TransportWebRtc.close, {
                kind: Kinds.screen,
                username: this.username,
                producerTransportId: (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.getTransportProducerId(),
                consumerTransportId: (_b = this.transportConsumer) === null || _b === void 0 ? void 0 : _b.getTransportConsumerId()
            });
            (_c = this.transportProducer) === null || _c === void 0 ? void 0 : _c.stopScreen();
        });
    }
    disconnect() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transportProducer)
                return;
            yield this.room.request(TransportWebRtc.close, {
                username: this.username,
                producerTransportId: (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.getTransportProducerId(),
                consumerTransportId: (_b = this.transportConsumer) === null || _b === void 0 ? void 0 : _b.getTransportConsumerId()
            });
            (_c = this.transportConsumer) === null || _c === void 0 ? void 0 : _c.stopConsume();
            (_d = this.transportProducer) === null || _d === void 0 ? void 0 : _d.stopProduce();
        });
    }
    stateMic(state) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!state) {
                (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.pauseMic();
                yield this.room.request(TransportWebRtc.pauseAudio, this.username);
            }
            else {
                yield ((_b = this.transportProducer) === null || _b === void 0 ? void 0 : _b.resumeMic());
                yield this.room.request(TransportWebRtc.resumeAudio, this.username);
            }
        });
    }
    stateCamera(state) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!state) {
                (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.pauseCam();
                yield this.room.request(TransportWebRtc.pauseVideo, this.username);
            }
            else {
                yield ((_b = this.transportProducer) === null || _b === void 0 ? void 0 : _b.resumeCam());
                yield this.room.request(TransportWebRtc.resumeVideo, this.username);
            }
        });
    }
}
//# sourceMappingURL=PeerConnection.js.map
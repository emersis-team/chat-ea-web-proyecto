import { __awaiter } from "tslib";
import { TransportWebRtc } from "../types/WebRtcConnection";
export class TransportProducer {
    constructor(device) {
        this.device = device;
    }
    producer(transportData, room) {
        this.transportProducer = this.device.createSendTransport(transportData);
        if (!this.transportProducer)
            throw new Error();
        this.transportProducer.on(TransportWebRtc.connect, ({ dtlsParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield room.request(TransportWebRtc.connectProducer, { transportId: (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.id, dtlsParameters });
            resolve(data);
        }));
        this.transportProducer.on(TransportWebRtc.produce, ({ kind, rtpParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const data = yield room.request(TransportWebRtc.produce, { transportId: (_b = this.transportProducer) === null || _b === void 0 ? void 0 : _b.id, kind, rtpParameters });
            resolve(data);
        }));
    }
    getTransportProducerId() {
        var _a;
        return (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.id;
    }
    sendScreen(screenShare) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transportProducer)
                return;
            this.screenProducer = yield this.transportProducer.produce({
                track: screenShare.getVideoTracks()[0]
            });
        });
    }
    stopScreen() {
        var _a;
        (_a = this.screenProducer) === null || _a === void 0 ? void 0 : _a.close();
    }
    sendVideo(videoAudioTrack) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transportProducer)
                return;
            this.camProducer = yield this.transportProducer.produce({
                track: videoAudioTrack.video
            });
            this.micProducer = yield this.transportProducer.produce({
                track: videoAudioTrack.audio
            });
        });
    }
    pauseCam() {
        var _a;
        (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.pause();
    }
    resumeCam() {
        var _a;
        (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.resume();
    }
    pauseMic() {
        var _a;
        (_a = this.micProducer) === null || _a === void 0 ? void 0 : _a.pause();
    }
    resumeMic() {
        var _a;
        (_a = this.micProducer) === null || _a === void 0 ? void 0 : _a.resume();
    }
    stopProduce() {
        var _a;
        (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.close();
    }
}
//# sourceMappingURL=TransportProducer.js.map
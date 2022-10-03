import { __awaiter } from "tslib";
import { TransportWebRtc } from "../types/WebRtcConnection";
export class TransportProducer {
    constructor(device, room) {
        this.device = device;
        this.room = room;
    }
    producer(transportData) {
        this.transportProducer = this.device.createSendTransport(transportData);
        if (!this.transportProducer)
            throw new Error();
        this.transportProducer.on(TransportWebRtc.connect, ({ dtlsParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield this.room.request(TransportWebRtc.connectProducer, { transportId: (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.id, dtlsParameters });
            resolve(data);
        }));
        this.transportProducer.on(TransportWebRtc.produce, ({ kind, rtpParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const data = yield this.room.request(TransportWebRtc.produce, { transportId: (_b = this.transportProducer) === null || _b === void 0 ? void 0 : _b.id, kind, rtpParameters });
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
                track: screenShare.getVideoTracks()[0],
                encodings: [
                    { maxBitrate: 100000 },
                    { maxBitrate: 300000 },
                    { maxBitrate: 900000 }
                ],
                //codec: this.device.rtpCapabilities.codecs?.find(c => c.mimeType.toLowerCase() === "video/vp8")
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
                track: videoAudioTrack.video,
                //codec: this.device.rtpCapabilities.codecs?.find(c => c.mimeType.toLowerCase() === "video/h264")
            });
            this.micProducer = yield this.transportProducer.produce({
                track: videoAudioTrack.audio
            });
        });
    }
    pauseCam(username) {
        var _a;
        (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.pause();
        this.room.request("stopVideo", { username });
    }
    resumeCam(username) {
        var _a;
        (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.resume();
        this.room.request("resumeVideo", { username });
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
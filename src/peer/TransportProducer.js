import { __awaiter } from "tslib";
import { CallHelper } from "@/helpers/CallHelper";
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
        var _a;
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
                codec: (_a = this.device.rtpCapabilities.codecs) === null || _a === void 0 ? void 0 : _a.find(c => c.mimeType.toLowerCase() === "video/vp8")
            });
        });
    }
    stopScreen() {
        var _a;
        (_a = this.screenProducer) === null || _a === void 0 ? void 0 : _a.close();
    }
    pauseCam() {
        var _a;
        (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.pause();
    }
    resumeCam() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.camProducer)
                (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.resume();
            else {
                const localVideoStream = yield CallHelper.loadLocalVideo();
                this.sendVideo({
                    video: (_b = localVideoStream.getVideoTracks()[0]) !== null && _b !== void 0 ? _b : null,
                    audio: (_c = localVideoStream.getAudioTracks()[0]) !== null && _c !== void 0 ? _c : null
                });
            }
        });
    }
    pauseMic() {
        var _a;
        (_a = this.micProducer) === null || _a === void 0 ? void 0 : _a.pause();
    }
    resumeMic() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.micProducer)
                (_a = this.micProducer) === null || _a === void 0 ? void 0 : _a.resume();
            else {
                const localVideoStream = yield CallHelper.loadLocalVideo();
                this.sendVideo({
                    video: (_b = localVideoStream.getVideoTracks()[0]) !== null && _b !== void 0 ? _b : null,
                    audio: (_c = localVideoStream.getAudioTracks()[0]) !== null && _c !== void 0 ? _c : null
                });
            }
        });
    }
    sendVideo(videoAudioTrack) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transportProducer)
                return;
            if (videoAudioTrack.video)
                this.camProducer = yield this.transportProducer.produce({
                    track: videoAudioTrack.video,
                    codec: (_a = this.device.rtpCapabilities.codecs) === null || _a === void 0 ? void 0 : _a.find(c => c.mimeType.toLowerCase() === "video/h264"),
                });
            if (videoAudioTrack.audio)
                this.micProducer = yield this.transportProducer.produce({
                    track: videoAudioTrack.audio
                });
        });
    }
    stopProduce() {
        var _a, _b, _c, _d;
        (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.close();
        (_b = this.micProducer) === null || _b === void 0 ? void 0 : _b.close();
        (_c = this.screenProducer) === null || _c === void 0 ? void 0 : _c.close();
        (_d = this.transportProducer) === null || _d === void 0 ? void 0 : _d.close();
    }
}
//# sourceMappingURL=TransportProducer.js.map
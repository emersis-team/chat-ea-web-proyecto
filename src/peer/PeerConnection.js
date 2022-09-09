import { __awaiter } from "tslib";
import { CallHelper } from "../helpers/CallHelper";
import { io } from "socket.io-client";
import { Device } from "mediasoup-client";
const promise = function (socket) {
    return function request(type, data = {}) {
        return new Promise((resolve) => {
            socket.emit(type, data, resolve);
        });
    };
};
export class PeerConnection {
    constructor(roomName, username) {
        this.username = username;
        this.roomName = roomName;
        this.room = io(`https://38.109.228.250:8080?room=${roomName}&client=${username}`);
        this.room.request = promise(this.room);
        this.room.on("connect", () => __awaiter(this, void 0, void 0, function* () {
            const RtpCapabilities = yield this.room.request("getRouterRtpCapabilities");
            this.device = new Device();
            yield this.device.load({ routerRtpCapabilities: RtpCapabilities });
            yield this.join();
        }));
        this.room.on("new", () => __awaiter(this, void 0, void 0, function* () {
            yield this.initPeers();
        }));
        this.room.on("removePeer", ({ usernames }) => {
            console.log(usernames);
            usernames.forEach((u) => CallHelper.removeSource(u));
        });
    }
    /*
        * Un `Producer` es el objeto para emitir video/audio a otros
    */
    join() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device)
                throw new Error("device not initialized");
            this.transportProducerData = yield this.room.request("createProducerTransport", {
                rtpcapabilities: this.device.rtpCapabilities
            });
            this.transportProducer = this.device.createSendTransport(this.transportProducerData);
            if (!this.transportProducer)
                throw new Error();
            this.transportProducer.on("connect", ({ dtlsParameters }, resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const data = yield this.room.request("connectProducerTransport", { transportId: (_a = this.transportProducer) === null || _a === void 0 ? void 0 : _a.id, dtlsParameters });
                resolve(data);
            }));
            this.transportProducer.on("produce", ({ kind, rtpParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const data = yield this.room.request("produce", { transportId: (_b = this.transportProducer) === null || _b === void 0 ? void 0 : _b.id, kind, rtpParameters });
                resolve(data);
            }));
            const videoAudioTrack = yield this.produceVideoAudio();
            this.transportProducer.appData.ss = true;
            this.camProducer = yield this.transportProducer.produce({ track: videoAudioTrack.video });
            this.micProducer = yield this.transportProducer.produce({ track: videoAudioTrack.audio });
            yield this.initPeers();
        });
    }
    produceVideoAudio() {
        return __awaiter(this, void 0, void 0, function* () {
            this.localVideoStream = yield CallHelper.loadLocalVideo();
            return {
                video: this.localVideoStream.getVideoTracks()[0],
                audio: this.localVideoStream.getAudioTracks()[0]
            };
        });
    }
    /*
        * Carga los videos remotos
    */
    initPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device)
                return;
            this.transportConsumerData = yield this.room.request("createConsumerTransport");
            this.transportConsumer = this.device.createRecvTransport(this.transportConsumerData);
            this.transportConsumer.on("connect", ({ dtlsParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
                const data = yield this.room.request("connectConsumerTransport", { transportId: this.transportConsumer.id, dtlsParameters });
                resolve(data);
            }));
            this.transportConsumer.on("connectionstatechange", (state) => __awaiter(this, void 0, void 0, function* () {
                switch (state) {
                    case "connected":
                        const streams = yield remoteStream;
                        if (streams)
                            Object.keys(streams).map((username) => CallHelper.loadRemoteVideo(username, streams[username]));
                        break;
                    case "failed":
                        this.transportConsumer.close();
                        console.error("error");
                        location.reload();
                        break;
                    default:
                        break;
                }
            }));
            const remoteStream = this.consumeAllRoom();
        });
    }
    consumeAllRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device)
                return;
            const { rtpCapabilities } = this.device;
            const { id: transportId } = this.transportConsumer;
            const consumers = yield this.room.request("consume", { roomName: this.roomName, transportId, rtpCapabilities });
            const streams = {};
            console.log(consumers);
            yield Promise.all(consumers.map(({ id, producerId, kind, rtpParameters, name }) => __awaiter(this, void 0, void 0, function* () {
                if (name === this.username)
                    return;
                const kindConsume = kind === "screen" ? "video" : kind;
                const consumer = yield this.transportConsumer.consume({ id, producerId, kind: kindConsume, rtpParameters });
                if (!streams[name])
                    streams[name] = { video: undefined, audio: undefined };
                if (kind === "video")
                    streams[name].video = consumer;
                else if (kind === "audio")
                    streams[name].audio = consumer;
                else if (kind === "screen")
                    streams[name].screen = consumer;
            })));
            return streams;
        });
    }
    shareScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transportProducer)
                return;
            const screenShare = yield CallHelper.loadLocalScreen();
            this.screenVideoProducer = yield this.transportProducer.produce({ track: screenShare.getVideoTracks()[0] });
        });
    }
    stopShare() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transportProducer)
                return;
            yield this.room.request("close", {
                kind: "screen",
                username: this.username,
                producerTransportId: this.transportProducer.id,
                consumerTransportId: this.transportConsumer.id
            });
            (_a = this.screenVideoProducer) === null || _a === void 0 ? void 0 : _a.close();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.transportProducer)
                return;
            yield this.room.request("close", {
                username: this.username,
                producerTransportId: this.transportProducer.id,
                consumerTransportId: this.transportConsumer.id
            });
            if (this.transportConsumer)
                this.transportConsumer.close();
            this.transportProducer.close();
        });
    }
    stateMic(state) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!state) {
                console.log("pause the mic");
                (_a = this.micProducer) === null || _a === void 0 ? void 0 : _a.pause();
                yield this.room.request("pauseAudio", this.username);
            }
            else {
                (_b = this.micProducer) === null || _b === void 0 ? void 0 : _b.resume();
                yield this.room.request("resumeAudio", this.username);
            }
        });
    }
    stateCamera(state) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!state) {
                console.log("pause the camara");
                (_a = this.camProducer) === null || _a === void 0 ? void 0 : _a.pause();
                yield this.room.request("pauseVideo", this.username);
            }
            else {
                (_b = this.camProducer) === null || _b === void 0 ? void 0 : _b.resume();
                yield this.room.request("resumeVideo", this.username);
            }
        });
    }
}
//# sourceMappingURL=PeerConnection.js.map
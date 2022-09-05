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
        this.room = io(`http://localhost:5000?room=${roomName}&client=${username}`);
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
        this.room.on("removePeer", ({ username }) => {
            console.log("leaving room " + username);
            CallHelper.removeSource(username);
        });
    }
    /*
        * Un `Producer` es el objeto para emitir video/audio a otros
    */
    join() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.device)
                throw new Error("device not initialized");
            if (!this.transportProducerData)
                this.transportProducerData = yield this.room.request("createProducerTransport", {
                    rtpcapabilities: this.device.rtpCapabilities
                });
            if (!this.transportProducer)
                this.transportProducer = this.device.createSendTransport(this.transportProducerData);
            this.transportProducer.on("connect", ({ dtlsParameters }, resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const data = yield this.room.request("connectProducerTransport", { transportId: this.transportProducer.id, dtlsParameters });
                resolve(data);
            }));
            this.transportProducer.on("produce", ({ kind, rtpParameters }, resolve, _reject) => __awaiter(this, void 0, void 0, function* () {
                const data = yield this.room.request("produce", { transportId: this.transportProducer.id, kind, rtpParameters });
                resolve(data);
            }));
            this.localVideoStream = yield CallHelper.loadLocalVideo();
            const videoTrack = this.localVideoStream.getVideoTracks()[0];
            yield this.transportProducer.produce({ track: videoTrack });
            yield this.initPeers();
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
                        console.log(state);
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
                        console.log(state);
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
            const consumers = yield this.room.request("consume", { transportId, rtpCapabilities });
            const streams = {};
            yield Promise.all(consumers.map(({ id, producerId, kind, rtpParameters, name }) => __awaiter(this, void 0, void 0, function* () {
                if (name === this.username)
                    return;
                const consumer = yield this.transportConsumer.consume({ id, producerId, kind, rtpParameters });
                const stream = new MediaStream();
                stream.addTrack(consumer.track);
                streams[name] = stream;
            })));
            console.log(consumers, Object.keys(streams));
            return streams;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.room.request("close", {
                username: this.username,
                producerTransportId: this.transportProducer.id,
                consumerTransportId: this.transportConsumer.id
            });
            if (this.transportConsumer)
                this.transportConsumer.close();
            if (this.transportProducer)
                this.transportProducer.close();
        });
    }
}
//# sourceMappingURL=PeerConnection.js.map
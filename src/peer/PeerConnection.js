var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Peer } from "peerjs";
import { Room } from "../room";
import { CallHelper } from "../helpers/CallHelper";
import { EventsWebRtc } from "../types/WebRtcConnection";
import { EnvSignaling } from "../types/Enviroment";
var PeerConnection = /** @class */ (function () {
    function PeerConnection(from) {
        this.usernameFrom = from;
        this.leave = false;
    }
    PeerConnection.prototype.connect = function (audio, video) {
        return __awaiter(this, void 0, void 0, function () {
            var room, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        room = new Room(this);
                        _a = this;
                        return [4 /*yield*/, CallHelper.loadLocalVideo(audio, video)];
                    case 1:
                        _a.localVideo = _b.sent();
                        this.peer = new Peer(this.usernameFrom, {
                            host: EnvSignaling.LOCAL_HOST.valueOf(),
                            port: EnvSignaling.LOCAL_PORT.valueOf(),
                            path: '/satac'
                        });
                        this.peer.on(EventsWebRtc.open, function (clientId) {
                            console.log("open");
                            room.joinRoom(clientId);
                        });
                        this.peer.on(EventsWebRtc.error, function (e) {
                            console.error("Intentando llamar", e.name, e.message);
                            throw new Error("");
                        });
                        this.peer.on(EventsWebRtc.call, function (call) {
                            call.answer(_this.localVideo);
                            room.users[call.peer] = call;
                            call.on(EventsWebRtc.stream, function (s) {
                                CallHelper.loadRemoteVideo(call.peer, s);
                            });
                        });
                        this.peer.on(EventsWebRtc.disconnected, function () {
                            console.log(_this.leave, "error de red");
                            if (!_this.leave) {
                                console.log("reconectando...");
                                _this.peer.reconnect();
                            }
                        });
                        this.room = room;
                        return [2 /*return*/];
                }
            });
        });
    };
    PeerConnection.prototype.toggleStatusCamAndMic = function (audio, video) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.localVideo
                    .getVideoTracks()
                    .forEach(function (track) { return (track.enabled = video); });
                this.localVideo
                    .getAudioTracks()
                    .forEach(function (track) { return (track.enabled = audio); });
                return [2 /*return*/];
            });
        });
    };
    PeerConnection.prototype.disconnectCall = function () {
        this.leave = true;
        this.room.leaveRoom(this.usernameFrom);
        this.peer.destroy();
        CallHelper.localVideoSource.srcObject = null;
        CallHelper.localVideoSource = null;
        delete CallHelper.remoteSources[this.usernameFrom];
    };
    PeerConnection.prototype.call = function (usernameTo) {
        try {
            var calling = this.peer.call(usernameTo, this.localVideo);
            calling.on(EventsWebRtc.stream, function (s) {
                return CallHelper.loadRemoteVideo(usernameTo, s);
            });
            return calling;
        }
        catch (e) {
            console.error("Fallo en la llamada a ", usernameTo, e);
            throw new Error("Error en la llamada, verifique la conexion a internet");
        }
    };
    return PeerConnection;
}());
export { PeerConnection };

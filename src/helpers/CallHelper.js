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
var CallHelper = /** @class */ (function () {
    function CallHelper() {
    }
    /**
     * Elimina un tag de video
     */
    CallHelper.removeSource = function (userId) {
        if (document.getElementById("video-" + userId))
            document.getElementById("video-" + userId).remove();
    };
    /**
     * Elimina todas las fuentes de video remotas
     */
    CallHelper.removeAllSources = function () {
        //document.getElementById("remoteVideo").innerHTML = "";
        document.querySelectorAll(".remote").forEach(function (div) {
            div.remove();
        });
    };
    /*
     * Pide uso del video y el audio al usuario y lo carga en un componente de video
     * lanza un error cuando no se define la fuente de video local
     * */
    CallHelper.loadLocalVideo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var streamLocal, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                video: { width: { ideal: 256 }, height: { ideal: 144 } },
                                audio: CallHelper.audio
                            })];
                    case 1:
                        streamLocal = _a.sent();
                        if (CallHelper.localVideoSource) {
                            CallHelper.localVideoSource.srcObject = streamLocal;
                            CallHelper.permissionCamaraOrMic = true;
                            return [2 /*return*/, streamLocal];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error("No se puede iniciar la llamada sin la camara");
                    case 3: throw new Error("No local source video was defined");
                }
            });
        });
    };
    /*
     * Pide uso de la pantalla del usuario para compartirla
     * */
    CallHelper.loadLocalScreen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, navigator.mediaDevices.getDisplayMedia({
                        video: true,
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            sampleRate: 44100
                        }
                    })];
            });
        });
    };
    /*
     * Guarda fuentes de video en un array para que puedan ser renderizadas en vue
     * */
    CallHelper.loadRemoteVideo = function (username, streamRemote) {
        console.log("adding streams", streamRemote);
        var totalSourcesLength = Object.values(this.remoteSources).length + 1;
        console.log("length", totalSourcesLength);
        this.remoteSources[username] = streamRemote;
        CallHelper.addVideo(username, streamRemote, totalSourcesLength);
    };
    CallHelper.addVideo = function (userId, source, totalSourcesLength) {
        if (document.querySelector("#video-".concat(userId)))
            return;
        var divRemoteVideos = document.getElementById("remoteVideo");
        divRemoteVideos.classList.add("divRemoteVideos");
        var stream = document.getElementById(userId);
        if (stream || !source.active)
            return;
        var videoDiv = document.createElement("div");
        videoDiv.classList.add("streamcontainer");
        videoDiv.classList.add("remote");
        videoDiv.setAttribute("id", "video-".concat(userId));
        var videocomp = document.createElement("video");
        var videouser = document.createElement("span");
        videouser.classList.add("username");
        videouser.textContent = userId;
        videocomp.srcObject = source;
        videocomp.autoplay = true;
        videocomp.setAttribute("controls", "true");
        videocomp.disablePictureInPicture = true;
        if (totalSourcesLength >= 3 || totalSourcesLength <= 4) {
            divRemoteVideos.style.setProperty("--videoWidth", "auto");
            divRemoteVideos.style.setProperty("--videoHeight", "40vh");
        }
        else if (totalSourcesLength >= 5 || totalSourcesLength <= 6) {
            divRemoteVideos.style.setProperty("--videoWidth", "31vw");
            divRemoteVideos.style.setProperty("--videoHeight", "auto");
        }
        else if (totalSourcesLength >= 7 || totalSourcesLength <= 8) {
            divRemoteVideos.style.setProperty("--videoWidth", "24vw");
            divRemoteVideos.style.setProperty("--videoHeight", "auto");
        }
        else if (totalSourcesLength >= 9 || totalSourcesLength <= 10) {
            divRemoteVideos.style.setProperty("--videoWidth", "19vw");
            divRemoteVideos.style.setProperty("--videoHeight", "auto");
        }
        videoDiv.appendChild(videocomp);
        videoDiv.appendChild(videouser);
        divRemoteVideos.appendChild(videoDiv);
    };
    /*
     * Desconecta de una llamada
     * */
    CallHelper.leaveCall = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                connection.disconnectCall();
                connection.peer.destroy();
                return [2 /*return*/];
            });
        });
    };
    /*Fuente de video de los otros participantes*/
    CallHelper.remoteSources = {};
    CallHelper.permissionCamaraOrMic = false;
    return CallHelper;
}());
export { CallHelper };

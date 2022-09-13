import { __awaiter } from "tslib";
export class CallHelper {
    /**
     * Elimina un tag de video
     */
    static removeSource(userId) {
        const video = document.getElementById("video-" + userId);
        if (video)
            video.remove();
    }
    /**
     * Elimina todas las fuentes de video remotas
     */
    static removeAllSources() {
        //document.getElementById("remoteVideo").innerHTML = "";
        document.querySelectorAll(".remote").forEach((div) => {
            div.remove();
        });
    }
    /*
     * Pide uso del video y el audio al usuario y lo carga en un componente de video
     * lanza un error cuando no se define la fuente de video local
     * */
    static loadLocalVideo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const streamLocal = yield navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: CallHelper.audio,
                });
                if (CallHelper.localVideoSource) {
                    CallHelper.localVideoSource.srcObject = streamLocal;
                    CallHelper.permissionCamaraOrMic = true;
                    return streamLocal;
                }
            }
            catch (e) {
                throw new Error("No se puede iniciar la llamada sin la camara");
            }
            throw new Error("No local source video was defined");
        });
    }
    /*
     * Pide uso de la pantalla del usuario para compartirla
     * */
    static loadLocalScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            return navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });
        });
    }
    /*
     * Guarda fuentes de video en un array para que puedan ser renderizadas en vue
     * */
    static loadRemoteVideo(username, consumerRemote) {
        if (!consumerRemote)
            return;
        const totalSourcesLength = Object.values(this.remoteSources).length + 1;
        const streamRemote = new MediaStream();
        streamRemote.addTrack(consumerRemote.video.track);
        streamRemote.addTrack(consumerRemote.audio.track);
        this.remoteSources[username] = streamRemote;
        if (consumerRemote.screen) {
            const streamScreen = new MediaStream();
            streamScreen.addTrack(consumerRemote.screen.track);
            CallHelper.addVideo(username + "_screen", streamScreen, totalSourcesLength);
        }
        CallHelper.addVideo(username, streamRemote, totalSourcesLength);
    }
    static addVideo(userId, source, totalSourcesLength) {
        if (document.querySelector(`#video-${userId}`))
            return;
        const divRemoteVideos = document.getElementById("remoteVideo");
        if (!divRemoteVideos)
            throw new Error("no remotes video container found");
        divRemoteVideos.classList.add("divRemoteVideos");
        const stream = document.getElementById(userId);
        if (stream || !source.active)
            return;
        const videoDiv = document.createElement("div");
        videoDiv.classList.add("streamcontainer");
        videoDiv.classList.add("remote");
        videoDiv.setAttribute("id", `video-${userId}`);
        const videocomp = document.createElement("video");
        const videouser = document.createElement("span");
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
    }
}
/*Fuente de video de los otros participantes*/
CallHelper.remoteSources = {};
CallHelper.permissionCamaraOrMic = false;
//# sourceMappingURL=CallHelper.js.map
<template>
  <div class="text-center">
    <div class="container-message">
      <ModalError
        :reason.sync="reasonError"
				:message.sync="messageError"
        @clear-error="clearError"
        v-if="!!reasonError"
      />
    </div>

    <div v-if="!joined" id="loginPage" class="text-center">
      <form @submit="login">
        <input
          type="text"
          id="usernameInput"
          v-model="usernameFrom"
          placeholder="username"
          required="required!!!"
          autofocus=""
        />
        <button id="loginBtn" type="submit" :disabled="!!!usernameFrom">
          Join
        </button>
      </form>
    </div>

    <div
      id="callPage"
      class="call-page"
      :class="{ disconected: joined === false }"
    >
      <div id="remoteVideo" ref="remoteVideo" class="divRemoteVideos">
        <div class="streamcontainer">
          <video
            :class="{ cameraOff: camera === false }"
            id="localVideo"
            ref="localVideo"
            autoplay
            muted
            controls
            disablePictureInPicture
          ></video>
          <span class="username local">{{ usernameFrom }}</span>
        </div>
      </div>

      <div class="footer-mc">
        <h6 v-if="screen" class="text-center warning">
          Estas compartiendo tu pantalla!!!
        </h6>

        <div class="panel">
          <button @click="hangUp" class="btn-off">
            <img src="../assets/call_end_black_24dp.svg" alt="imagen" />
          </button>

          <button
            v-if="screen"
            ref="screen"
            @click="shareScreen"
            class="btn-on"
          >
            <font-awesome-icon icon="fa-solid fa-display" />
          </button>

          <button
            v-if="!screen"
            ref="screen"
            @click="shareScreen"
            class="btn-off"
          >
            <font-awesome-icon icon="fa-solid fa-display" />
          </button>

          <button v-if="microphone" @click="toggleMic" class="btn-on">
            <font-awesome-icon icon="fa-solid fa-microphone" />
          </button>

          <button v-if="!microphone" @click="toggleMic" class="btn-off">
            <font-awesome-icon icon="fa-solid fa-microphone-slash" />
          </button>

          <button v-if="camera" @click="toggleCam" class="btn-on">
            <font-awesome-icon icon="fa-solid fa-video" />
          </button>

          <button v-if="!camera" @click="toggleCam" class="btn-off">
            <font-awesome-icon icon="fa-solid fa-video-slash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ModalError from "../components/ModalError.vue";
import { CallHelper } from "../helpers/CallHelper";
import { PeerConnection } from "../peer/PeerConnection";
import { ShareScreen } from "../peer/ShareScreen";

export default {
  components: {
    ModalError,
  },
  data() {
    return {
      connection: null,
      screen: null,
      usernameTo: "",
      usernameFrom: "",
      joined: false,
      reasonError: "",
      microphone: true,
      camera: true,
    };
  },
  methods: {
    clearError(e) {
			console.log(e);
      this.reasonError = e;
      console.log("limpiando error");
    },
    async login(e) {
      e.preventDefault();

      try {
        CallHelper.localVideoSource = this.$refs.localVideo;

        CallHelper.showError = this.clearError;

        this.connection = await CallHelper.enterCall(
          this.usernameFrom,
          PeerConnection,
          this.microphone,
          this.camera
        );
        this.joined = true;
      } catch (error) {
        CallHelper.showError(error);
      }
    },
    async shareScreen() {
      try {
        if (!this.screen) {
          this.screen = await CallHelper.enterCall(
            this.usernameFrom,
            ShareScreen,
            this.microphone,
            this.camera
          );
        } else {
          CallHelper.leaveCall(this.screen);
          this.screen = null;
        }
      } catch (error) {
        console.log(error);
        this.reasonError = error.message;
      }
    },
    hangUp() {
      CallHelper.removeAllSources();

      if (this.screen) CallHelper.leaveCall(this.screen);

      CallHelper.leaveCall(this.connection);
      this.joined = false;
    },
    async toggleCam() {
      this.camera = !this.camera;
      console.log(this.camera, this.microphone);
      await this.connection.toggleStatusCamAndMic(this.microphone, this.camera);
    },
    async toggleMic() {
      this.microphone = !this.microphone;
      console.log(this.camera, this.microphone);
      await this.connection.toggleStatusCamAndMic(this.microphone, this.camera);
    },
  },
};
</script>

<style>
/* :root {
  --videoWidth: 700px;
  --videoHeight: auto;
} */

body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: rgb(32, 32, 34);
  width: 100vw;
  height: 100vh;
}

.text-center {
  text-align: center;
}

form {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

form input {
  line-height: 40px;
  font-size: 20px;
  border-radius: 15px;
  padding: 0 20px;
  outline-color: rgb(201, 200, 221);
}

form button {
  font-size: 20px;
  color: aliceblue;
  padding: 0 20px;
  background-color: rgb(19, 19, 146);
  margin-left: 10px;
  border-radius: 15px;
  border-color: rgb(19, 19, 146);
}

form button:hover {
  color: white;
  background-color: rgb(3, 3, 136);
  border-color: rgb(3, 3, 136);
  cursor: pointer;
}

form button:disabled {
  background-color: rgb(93, 93, 131);
  cursor: none;
}

.login {
  max-width: 600px;
}

.disconected {
  display: none;
}

.divRemoteVideos {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
  --videoWidth: 700px;
  --videoHeight: auto;
}

.streamcontainer {
  position: relative;
}

.streamcontainer video {
  background: black;
  border: 5px solid gray;
  width: var(--videoWidth);
  max-width: 100vw;
  height: var(--videoHeight);
  max-height: 90vh;
  margin: 2px;
}

.streamcontainer video::-webkit-media-controls-play-button,
video::-webkit-media-controls-timeline,
video::-webkit-media-controls-toggle-closed-captions-button,
video::-webkit-media-controls-current-time-display {
  display: none;
}

.streamcontainer .username {
  position: absolute;
  top: 7px;
  left: 7px;
  color: aliceblue;
  background-color: black;
  font-weight: bold;
  margin: 0;
  padding: 0 5px;
  border-radius: 10%;
}

.streamcontainer .local {
  color: chartreuse;
}

form {
  margin: 40vh;
}

.container-message {
  position: relative;
}

.footer-mc {
  display: flex;
  flex-direction: column;
  height: 10vh;
  justify-content: end;
  align-items: center;
}

.warning {
  font-size: 15px;
  color: rgb(255, 255, 1);
  margin: 0;
}

.panel {
  text-align: center;
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
  width: fit-content;
}

.panel button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border-color: transparent;
  margin: 0 5px;
  justify-content: center;
  align-items: center;
}

.btn-on {
  background-color: rgb(125, 123, 123);
  color: whitesmoke;
}

.btn-off {
  background-color: rgb(245, 76, 76);
  color: whitesmoke;
}

.btn-off img {
  width: 20px;
  height: auto;
}
</style>

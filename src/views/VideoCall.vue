<template>
  <div class="container text-center">
    <div class="container-message">
      <ModalError
        :reason.sync="reasonError"
        :message.sync="messageError"
        @clear-error="clearError"
        v-if="!!reasonError"
      />
    </div>
    <div v-if="!joined" id="loginPage" class="text-center">
      <form @submit="join">
        <button
          type="button"
          v-if="microphone"
          @click="toggleMic"
          class="btn-on"
        >
          <font-awesome-icon icon="fa-solid fa-microphone" />
        </button>

        <button
          type="button"
          v-if="!microphone"
          @click="toggleMic"
          class="btn-off"
        >
          <font-awesome-icon icon="fa-solid fa-microphone-slash" />
        </button>

        <button
          type="button"
          v-if="camera"
          @click="getNewPermissionVideo"
          class="btn-on"
        >
          <font-awesome-icon icon="fa-solid fa-video" />
        </button>

        <button
          type="button"
          v-if="!camera"
          @click="getNewPermissionVideo"
          class="btn-off"
        >
          <font-awesome-icon icon="fa-solid fa-video-slash" />
        </button>

        <button id="loginBtn" type="submit">Join</button>
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
          Esta compartiendo la pantalla!!!
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
import ModalError from "@/components/ModalError.vue";
import { CallHelper } from "../helpers/CallHelper";
import { PeerConnection } from "../peer/PeerConnection";

export default {
  components: {
    ModalError,
  },
  data() {
    return {
      connection: null,
      screen: false,
      localVideoPermission: null,
      usernameTo: "",
      usernameFrom: "",
      room: "",
      joined: false,
      reasonError: "",
      microphone: true,
      camera: true,
    };
  },
  mounted() {
    this.usernameFrom = localStorage.getItem("$userName"); //this.$route.query.username;
    this.room = localStorage.getItem("$room"); //this.$route.query.room;

    CallHelper.video = this.camera;
    CallHelper.audio = this.microphone;
    CallHelper.showError = this.clearError;
  },
  methods: {
    clearError(e) {
      console.log(e);
      this.reasonError = e;
    },
    async join(e) {
      e.preventDefault();

      try {
        CallHelper.localVideoSource = this.$refs.localVideo;

        this.connection = new PeerConnection(this.room, this.usernameFrom);

        this.joined = true;
      } catch (error) {
        CallHelper.showError(error);
      }
    },
    async shareScreen() {
      try {
        if (this.screen) {
          this.screen = false;
          await this.connection.stopShare();
          return;
        }

        await this.connection.shareScreen();
        this.screen = true;
      } catch (error) {
        console.log(error);
        this.reasonError = error.message;
      }
    },
    hangUp() {
      this.connection.disconnect();

      CallHelper.removeAllSources();
      this.joined = false;

      location.reload();
    },
    async getNewPermissionVideo() {
      CallHelper.video = this.camera = !this.camera;
    },
    async getNewPermissionAudio() {
      CallHelper.audio = this.microphone = !this.microphone;
    },
    async toggleCam() {
      this.camera = !this.camera;
			this.connection.stateCamera(this.camera);
    },
    async toggleMic() {
      this.microphone = !this.microphone;
			this.connection.stateMic(this.microphone);
    },
  },
};
</script>

<style>
.container {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: no-repeat center/100% url("../assets/img/fondowp.png");
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
  background-color: #3ea06c;
  margin-left: 10px;
  border-radius: 15px;
  border-color: #3ea06c;
}

form button:hover {
  color: white;
  background-color: #09c561;
  border-color: #09c561;
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
  padding: 40vh;
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

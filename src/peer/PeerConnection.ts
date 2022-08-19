import { CallHelper } from "../helpers/CallHelper";
import { WebRtcConnection, EventsWebRtc } from "../types/WebRtcConnection";
import { io } from "socket.io-client";
import mediaSoup from "mediasoup-client";

let device: mediaSoup.Device;
const room = io("", { room: "" });

async function init() {

	room.on(EventsWebRtc.open, (clientId) => { 
		const RTPCapabilities = await room.emit("GetRtpCapabilities"); //room.emit()
		device = new mediaSoup.Device();
		device.load(RTPCapabilities);
	});
}

/**
	* Un `Producer` es el objeto para emitir video/audio a otros
*/
async function join() {
	const trandportProducerData = await room.emit("createTransportProducer", {
		rtpcapabilities: device.rtpCapabilites
	});

	const transportProducer = device.createSendTransport();
	const localVideoStream = await CallHelper.loadLocalVideo();
	const videoTrack = localVideoStream.getVideoTrack()[0];

	await transportProducer.produce({ videoTrack });

	initPeers();
}

async function initPeers() {
	const transportConsumerData = room.emit("createTransportConsumer");
	const transportConsumer = device.createRecvTransport(transportConsumerData);
	transportConsumer.on("connect");
	transportConsumer.on("connectionState");
}
     

export class PeerConnection implements WebRtcConnection {
	room: Object;
  usernameFrom: string;
  localVideo: MediaStream;

  constructor(from: string, localVideo: MediaStream) {
    this.usernameFrom = from;
    this.leave = false;
		this.localVideo = localVideo;
  }

  async connect() {
		let device;
    this.peer.on(EventsWebRtc.error, (e: Error) => {
      console.error("Intentando llamar", e.name, e.message);
      throw new Error("");
    });

    this.peer.on(EventsWebRtc.call, (call: any) => {
      call.answer(this.localVideo);
      room.users[call.peer] = call;
      call.on(EventsWebRtc.stream, (s: MediaStream) => {
        CallHelper.loadRemoteVideo(call.peer, s);
      });
    });

		this.peer.on(EventsWebRtc.disconnected, () => {
			if(!this.leave) {
				console.log("reconectando...");
				this.peer.reconnect();
			}
		});

		this.device = device;
  }

  async toggleStatusCamAndMic(audio: boolean, video: boolean) {
    this.localVideo
      .getVideoTracks()
      .forEach((track) => (track.enabled = video));

    this.localVideo
      .getAudioTracks()
      .forEach((track) => (track.enabled = audio));
  }

  disconnectCall() {
		this.leave = true;
    this.room.leaveRoom(this.usernameFrom);
		this.peer.destroy();

    CallHelper.localVideoSource.srcObject = null;
    delete CallHelper.remoteSources[this.usernameFrom];
  }

  call(usernameTo: string): MediaConnection {
    try {
      const calling = this.peer.call(usernameTo, this.localVideo);
      calling.on(EventsWebRtc.stream, (s: MediaStream) =>
        CallHelper.loadRemoteVideo(usernameTo, s)
      );
      return calling;
    } catch (e) {
      console.error("Fallo en la llamada a ", usernameTo, e);
			throw new Error("Error en la llamada, verifique la conexion a internet");
    }
  }
}


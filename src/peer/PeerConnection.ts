import { Peer, MediaConnection } from "peerjs";
import { Room } from "../room";
import { CallHelper } from "../helpers/CallHelper";
import { WebRtcConnection, EventsWebRtc } from "../types/WebRtcConnection";
import { EnvSignaling } from "../types/Enviroment";

export class PeerConnection implements WebRtcConnection {
  usernameFrom: string;
  localVideo: MediaStream;
  peer: Peer;
  room: Room;
  leave: boolean;

  constructor(from: string, localVideo: MediaStream) {
    this.usernameFrom = from;
    this.leave = false;
		this.localVideo = localVideo;
  }

  async connect() {
    //this.peer = new Peer(this.usernameFrom);
    let room: Room = new Room(this);

		this.peer = new Peer(this.usernameFrom, {
      host: EnvSignaling.PROD_HOST.valueOf(),
			port: EnvSignaling.PROD_PORT.valueOf(),
			path: '/satac',
			secure: true // en local esta linea se comenta
		});

    this.peer.on(EventsWebRtc.open, (clientId) => { 
			console.log("open");
			room.joinRoom(clientId)
		});
     

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

    this.room = room;
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


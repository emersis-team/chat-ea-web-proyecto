import { Peer, MediaConnection } from "peerjs";
import { Room } from "../room";
import { CallHelper } from "../helpers/CallHelper";
import { WebRtcConnection, EventsWebRtc } from "../types/WebRtcConnection";
import { EnvSignaling } from "../types/Enviroment";

export class ShareScreen implements WebRtcConnection {
	usernameFrom: string;
	localVideo: MediaStream;
	peer: Peer;
	room: Room;
	leave: boolean;

  constructor(from: string) {
    this.usernameFrom = `${from}_screen`;
  }

  async connect(roomId: string) {
    this.localVideo = await CallHelper.loadLocalScreen();

		this.peer = new Peer(this.usernameFrom, {
      host: EnvSignaling.PROD_HOST.valueOf(),
			port: EnvSignaling.PROD_PORT.valueOf(),
			path: '/satac',
			secure: true // en local esta linea se comenta
		});

		const room = new Room(this, roomId);
    this.peer.on(EventsWebRtc.open, (clientId : string) => room.joinRoom(clientId));
    this.peer.on(EventsWebRtc.error, e => console.error("Intentando llamar", e));
    this.peer.on(EventsWebRtc.call, (call : any) => {
      call.answer(this.localVideo);
    });
		this.peer.on(EventsWebRtc.disconnected, () => {
			if(!this.leave) {
				this.peer.reconnect();
			}
		});

    this.room = room;
  }

  disconnectCall() {
		this.leave = true;
		this.localVideo.getTracks().forEach(track => track.stop());
    this.room.leaveRoom(this.usernameFrom);
    delete CallHelper.remoteSources[this.usernameFrom];
  }

  call(usernameTo: string) : MediaConnection {
    try {
			return this.peer.call(usernameTo, this.localVideo);
    } catch (e) {
      console.error("Fallo en la llamada a ", usernameTo, e);
			throw new Error("Error en la llamada, verifique la conexion a internet");
    }
  }
}


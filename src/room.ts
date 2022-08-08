import { MediaConnection } from "peerjs";
import { io } from "socket.io-client";
import { WebRtcConnection } from "./types/WebRtcConnection";
import { EventsRoom } from "./types/Room";
import { EnvRoom } from "./types/Enviroment";
import { CallHelper } from "./helpers/CallHelper";

const host = EnvRoom.PROD_HOST.valueOf();

const socket = io(host);

export class Room {
  users: Record<string, MediaConnection>;
  roomId: string;
  peerConnection: WebRtcConnection;

  constructor(peer: WebRtcConnection) {
    this.users = {};
    this.roomId = this.getRoomId();
    this.peerConnection = peer;
    this.initEvents();
  }

  getRoomId(): string {
    // TODO: Esto se va a obtener por api al server de java para saber el nombre del grupo
    return "CIDESO";
  }

  /*
   * Eventos que le llegan a todos los usuarios de un room
   */
  initEvents() {
    socket.on(EventsRoom.new, (userId: string) => {
      try {
        console.log("Entrando", userId);
        this.users[userId] = this.peerConnection.call(userId);
      } catch (error) {
        CallHelper.showError(error);
      }
    });

    socket.on(EventsRoom.leave, (userId: string) => {
      CallHelper.removeSource(userId);
      this.users[userId].close(); // si no existe quiero que rompa, porque es un error
    });
  }

  joinRoom(clientId: string): void {
    socket.emit(EventsRoom.joinRoom, this.roomId, clientId);
  }

  leaveRoom(clientId: string): void {
    socket.emit(EventsRoom.leaveRoom, clientId);
    Object.values(this.users).forEach((peerUser: MediaConnection) =>
      peerUser.close()
    );
  }
}

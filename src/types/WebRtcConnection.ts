import { MediaConnection, Peer } from "peerjs";
import { Room } from "../room";

enum EventsWebRtc {
	open = "open",
	error = "error",
	call = "call",
	stream = "stream",
	disconnected = "disconnected"
}

interface WebRtcConnection {
	usernameFrom: string;
	localVideo: MediaStream;
	peer: Peer;
	room: Room;
	leave: boolean;
	call(userId: string) : MediaConnection;
	disconnectCall() : void;
}

export {
	EventsWebRtc,
	WebRtcConnection
}

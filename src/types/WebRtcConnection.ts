import { MediaConnection, Peer } from "peerjs";

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
	leave: boolean;
	call(userId: string) : MediaConnection;
	disconnectCall() : void;
}

export {
	EventsWebRtc,
	WebRtcConnection
}

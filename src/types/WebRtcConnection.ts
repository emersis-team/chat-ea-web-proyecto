import { types } from "mediasoup-client";

enum EventsWebRtc {
	connect = "connect",
	error = "error",
	new = "new",
	removePeer = "removePeer",
	disconnected = "disconnected"
}

enum TransportWebRtc {
	connect = "connect",
	produce = "produce",
	consume = "consume",
	close = "close",
	rtpCapabilities = "getRouterRtpCapabilities",
	connectionState = "connectionstatechange",
	createConsumer = "createConsumerTransport",
	connectConsumer = "connectConsumerTransport",
	createProducer = "createProducerTransport",
	connectProducer = "connectProducerTransport",
	pauseVideo = "pauseVideo",
	resumeVideo = "resumeVideo",
	pauseAudio = "pauseAudio",
	resumeAudio = "resumeAudio",
}

enum Kinds {
	screen = "screen",
  video = "video",
	audio = "audio"
}

interface Stream {
	video?: types.Consumer;
	audio?: types.Consumer;
	screen?: types.Consumer;
}

interface StreamConsumers {
  [k: string]: Stream;
}

interface TrackMedia {
	video: MediaStreamTrack,
	audio: MediaStreamTrack
}


export {
	EventsWebRtc,
	TransportWebRtc,
	StreamConsumers,
	TrackMedia,
	Kinds
}

var EventsWebRtc;
(function (EventsWebRtc) {
    EventsWebRtc["connect"] = "connect";
    EventsWebRtc["error"] = "error";
    EventsWebRtc["new"] = "new";
    EventsWebRtc["removePeer"] = "removePeer";
    EventsWebRtc["disconnected"] = "disconnected";
    EventsWebRtc["pauseVideo"] = "pauseVideo";
    EventsWebRtc["resumeVideo"] = "resumeVideo";
})(EventsWebRtc || (EventsWebRtc = {}));
var TransportWebRtc;
(function (TransportWebRtc) {
    TransportWebRtc["connect"] = "connect";
    TransportWebRtc["produce"] = "produce";
    TransportWebRtc["consume"] = "consume";
    TransportWebRtc["close"] = "close";
    TransportWebRtc["rtpCapabilities"] = "getRouterRtpCapabilities";
    TransportWebRtc["connectionState"] = "connectionstatechange";
    TransportWebRtc["createConsumer"] = "createConsumerTransport";
    TransportWebRtc["connectConsumer"] = "connectConsumerTransport";
    TransportWebRtc["createProducer"] = "createProducerTransport";
    TransportWebRtc["connectProducer"] = "connectProducerTransport";
    TransportWebRtc["pauseVideo"] = "pauseVideo";
    TransportWebRtc["resumeVideo"] = "resumeVideo";
    TransportWebRtc["pauseAudio"] = "pauseAudio";
    TransportWebRtc["resumeAudio"] = "resumeAudio";
})(TransportWebRtc || (TransportWebRtc = {}));
var Kinds;
(function (Kinds) {
    Kinds["screen"] = "screen";
    Kinds["video"] = "video";
    Kinds["audio"] = "audio";
})(Kinds || (Kinds = {}));
export { EventsWebRtc, TransportWebRtc, Kinds };
//# sourceMappingURL=WebRtcConnection.js.map
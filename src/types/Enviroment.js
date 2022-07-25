var EnvSignaling;
(function (EnvSignaling) {
    EnvSignaling["PROD_HOST"] = "ws-signaling.herokuapp.com";
    EnvSignaling[EnvSignaling["PROD_PORT"] = 443] = "PROD_PORT";
    EnvSignaling["LOCAL_HOST"] = "localhost";
    EnvSignaling[EnvSignaling["LOCAL_PORT"] = 9000] = "LOCAL_PORT";
})(EnvSignaling || (EnvSignaling = {}));
;
var EnvRoom;
(function (EnvRoom) {
    EnvRoom["PROD_HOST"] = "ws-room-server.herokuapp.com";
    EnvRoom["LOCAL_HOST"] = "http://localhost:5000";
})(EnvRoom || (EnvRoom = {}));
;
export { EnvSignaling, EnvRoom };

import { io } from "socket.io-client";
import { EventsRoom } from "./types/Room";
import { EnvRoom } from "./types/Enviroment";
import { CallHelper } from "./helpers/CallHelper";
var host = EnvRoom.PROD_HOST.valueOf();
var socket = io(host);
var Room = /** @class */ (function () {
    function Room(peer, roomId) {
        this.users = {};
        this.roomId = roomId;
        this.peerConnection = peer;
        this.initEvents();
    }
    /*
     * Eventos que le llegan a todos los usuarios de un room
     */
    Room.prototype.initEvents = function () {
        var _this = this;
        socket.on(EventsRoom["new"], function (userId) {
            try {
                console.log("Entrando", userId);
                _this.users[userId] = _this.peerConnection.call(userId);
            }
            catch (error) {
                CallHelper.showError(error);
            }
        });
        socket.on(EventsRoom.leave, function (userId) {
            CallHelper.removeSource(userId);
            _this.users[userId].close(); // si no existe quiero que rompa, porque es un error
        });
    };
    Room.prototype.joinRoom = function (clientId) {
        socket.emit(EventsRoom.joinRoom, this.roomId, clientId);
    };
    Room.prototype.leaveRoom = function (clientId) {
        socket.emit(EventsRoom.leaveRoom, clientId);
        Object.values(this.users).forEach(function (peerUser) {
            return peerUser.close();
        });
    };
    return Room;
}());
export { Room };

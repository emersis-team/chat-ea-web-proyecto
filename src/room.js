import { io } from "socket.io-client";
import { EventsRoom } from "./types/Room";
import { EnvRoom } from "./types/Enviroment";
import { CallHelper } from "./helpers/CallHelper";
var host = EnvRoom.LOCAL_HOST.valueOf();
var socket = io(host);
var Room = /** @class */ (function () {
    function Room(peer) {
        this.users = {};
        this.roomId = this.getRoomId();
        this.peerConnection = peer;
        this.initEvents();
    }
    Room.prototype.getRoomId = function () {
        // TODO: Esto se va a obtener por api al server de java para saber el nombre del grupo
        return "CIDESO";
    };
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
                debugger;
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

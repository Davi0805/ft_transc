import { WebSocket } from "ws"

type TUserSocket = {
    lobbyID: number,
    userID: number,
    socket: WebSocket
}

class SocketRepository {
    addSocket(lobbyID: number, userID: number, socket: WebSocket) {
        this._sockets.push({
            lobbyID: lobbyID,
            userID: userID,
            socket: socket
        })
    }

    removeSocketByUserID(userID: number) {
        this._sockets = this._sockets.filter(socket => socket.userID !== userID)
    }

    getSocketsByLobbyID(lobbyID: number): WebSocket[] {
        const userSockets = this._sockets.filter(socket => socket.lobbyID === lobbyID);
        return userSockets.map(socket => socket.socket)
    }

    private _sockets: TUserSocket[] = []
}

export const socketRepository = new SocketRepository()
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

    getSocketByUserID(userID: number) {
        const userSocket = this._sockets.find(socket => socket.userID === userID);
        if (!userSocket) {return null}
        return userSocket.socket
    }

    getSocketsByUserIDs(userIDs: number[]) {
        const userSockets = this._sockets.filter(socket => userIDs.includes(socket.userID))
        return userSockets.map(socket => socket.socket);
    }

    getSocketsByLobbyID(lobbyID: number): WebSocket[] {
        const userSockets = this._sockets.filter(socket => socket.lobbyID === lobbyID);
        return userSockets.map(socket => socket.socket)
    }

    private _sockets: TUserSocket[] = []
}

export const socketRepository = new SocketRepository()
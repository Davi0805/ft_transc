class SocketRepository {
    addSocket(lobbyID, userID, socket) {
        this._sockets.push({
            lobbyID: lobbyID,
            userID: userID,
            socket: socket
        });
    }
    removeSocketByUserID(userID) {
        this._sockets = this._sockets.filter(socket => socket.userID !== userID);
    }
    getSocketByUserID(userID) {
        const userSocket = this._sockets.find(socket => socket.userID === userID);
        if (!userSocket) {
            throw Error("This userID does not have a socket open!");
        }
        return userSocket.socket;
    }
    getSocketsByUserIDs(userIDs) {
        const userSockets = this._sockets.filter(socket => userIDs.includes(socket.userID));
        return userSockets.map(socket => socket.socket);
    }
    getSocketsByLobbyID(lobbyID) {
        const userSockets = this._sockets.filter(socket => socket.lobbyID === lobbyID);
        return userSockets.map(socket => socket.socket);
    }
    _sockets = [];
}
export const socketRepository = new SocketRepository();

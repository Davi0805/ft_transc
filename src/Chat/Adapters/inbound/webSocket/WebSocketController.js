class WebSocketController {
    async helloWorld(socket, req) // the infamous hello world
    {
        socket.on('message', message => {
            socket.send('hello world mfc');
        })
    }
}

module.exports = new WebSocketController();
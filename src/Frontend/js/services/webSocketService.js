// publish-subscribe pattern
// Publishers: The WebSocket (publishes messages)
// Subscribers: Your chat windows, sidebar, notifications (subscribe to message types)
// Message Broker: The messageHandlers system (routes messages to subscribers)
class WebSocketService {
    constructor () {
        this.ws = null;
        this.isConnected = false;
        this.reconnectAttempts = 0; // current
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.userID = null;
        this.messageHandlers = new Map();
    }

    // TODO CHECK WITH DAVI HOW WE CONNECT WITH WEBSOCKET
    /**
     * - `onopen`: Triggered when the connection is successfully established. Marks the connection as active and sends
     *   a "user_connected" message to the server.
     * - `onmessage`: Triggered when a message is received from the server. Attempts to parse the message as JSON and
     *   passes it to a handler function.
     * - `onclose`: Triggered when the connection is closed. If the closure was not normal (code !== 1000), it will
     *   attempt to reconnect a limited number of times, with increasing delay between attempts.
     * - `onerror`: Triggered when an error occurs with the WebSocket connection. Marks the connection as inactive and
     *   logs the error.
     *
     * @param {string} token - The authentication token for the user (may be used for secure connections).
     * @param {string|number} userID - The unique identifier for the user connecting to the WebSocket.
     */
    connect(token, userID) {
        if (this.ws && this.ws.readyState === WebSocketService.OPEN) {
            console.log("DEBUG: WebSocket already connected");
            return ;
        }

        this.userID = userID;
        // TODO HERE should we add token?
        this.ws = new WebSocket();

        this.ws.onopen = (ev) => {
            console.log("DEBUG: WebSocket connected");
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // TODO initial connection message. check with davi ASWELL
            this.send({
                type: 'user_connected',
                userID: this.userID,
                timestamp: new Date().toISOString()
            });
        };
        this.ws.onmessage = (ev) => {
            try {
                const data = JSON.parse(ev.data);
                this.handleMessage(data);
            } catch (error) {
                console.log("DEBUG: Error parsing websocket message");                
            }
        };
        this.ws.onclose = (ev) => {
            console.log('DEBUG: websocket closed:'. ev.code, ev.reason);
            this.isConnected = false;

            if (ev.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                setTimeout(() => {
                    console.log(`Reconnection attempt ${this.reconnectAttempts}`);
                    this.connect(token, userID);
                }, this.reconnectAttempts * this.reconnectDelay); 
            }
        };
        this.ws.onerror = (error) => {
            console.error('DEBUG: WebSocket error:', error);
            this.isConnected = false;
        }
    }

    /**
     * Closes the WebSocket connection.
     * - Closes with code 1000 (normal closure) and a reason.
     * - Resets the WebSocket instance and connection status.
     */
    disconnect() {
        if (this.ws) {
            this.ws.close(1000, 'User Disconnected');
            this.ws = null;
            this.isConnected = false;
        }
    }
    /**
     * Sends a message through the WebSocket connection.
     * - Serializes the provided data as JSON and sends it if the connection is open.
     * - Logs a debug message and returns false if the WebSocket is not connected.
     *
     * @param {Object} data - The data to send to the server.
     * @returns {boolean} True if the message was sent successfully, false otherwise.
     */
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
            return true; // sent successfully
        }
        console.log('DEBUG: WebSocket not connected, message not sent!');
        return false;
    }

    /**
     * Registers a handler function to be called when a message of the specified type is received.
     *
     * @param {string} type - The type of message to listen for.
     * @param {Function} handler - The function to handle the message.
     */
    onMessage(type, handler) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, []);
        }
        this.messageHandlers.get(type).push(handler);
    }

    /**
     * Removes a specific message handler for a given message type.
     *
     * @param {string} type - The type of message to remove the handler from.
     * @param {Function} handler - The handler function to be removed.
     */
    offMessage(type, handler) {
        if (this.messageHandlers.has(type)) {
            const handlers = this.messageHandlers.get(type);
            const index = handlers.indexOf(handler); // if not found returns -1
            if (index > -1)
                handlers.splice(index, 1); // remove from the array at that position
        }
    }

    /**
     * Handles incoming WebSocket messages by dispatching them to registered handlers based on message type.
     *
     * @param {Object} data - The message data received from the WebSocket.
     * @param {string} data.type - The type of the message, used to determine which handlers to invoke.
     */
    handleMessage(data) {
        const { type } = data; // const type = data.type
        if (this.messageHandlers.has(type)) {
            this.messageHandlers.get(type).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in message handler for type ${type}:`, error);
                }
            });
        }
    }

    /**
     * Sends a chat message to a specified recipient via WebSocket.
     *
     * @param {string|number} recipientID - The unique identifier of the message recipient.
     * @param {string} message - The content of the chat message to send.
     * @returns {boolean} 
     */
    sendChatMessage(recipientID, message) {
        return this.send({
            type: 'chat_message',
            senderID: this.userID,
            recipientID: recipientID,
            message: message,
            timestamp: new Date().toISOString()
        });
    }

    isConnectionOpen() {
        return this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

export const webSocketService = new WebSocketService();
import { chatWindowControler } from "../components/chatWindow.js";

class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0; // current
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.userID = null;

    // Message Handling
    this.messageHandlers = new Map();
    this.conversationTracker = new Map();
    this.notificationCallbacks = [];
    this.onlineCallbacks = [];
  }

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
      return;
    }

    this.userID = userID;
    // 1. Query parameter (mais comum)
    // const wsUrl = `ws://localhost:8081/ws?token=${encodeURIComponent(token)}`;
    // this.ws = new WebSocket(wsUrl);

    // 2. Sub-protocolo
    this.ws = new WebSocket("ws://localhost:8081/ws", [`Bearer.${token}`]);

    this.ws.onopen = (ev) => {
      console.log("DEBUG: WebSocket connected");
      this.isConnected = true;
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
      console.log("DEBUG: websocket closed:", ev.code, ev.reason);
      this.isConnected = false;

      if (
        ev.code !== 1000 &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`Reconnection attempt ${this.reconnectAttempts}`);
          this.connect(token, userID);
        }, this.reconnectAttempts * this.reconnectDelay);
      }
    };
    this.ws.onerror = (error) => {
      console.error("DEBUG: WebSocket error:", error);
      this.isConnected = false;
    };
  }

  /**
   * Closes the WebSocket connection.
   * - Closes with code 1000 (normal closure) and a reason.
   * - Resets the WebSocket instance and connection status.
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "User Disconnected");
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
    console.log("DEBUG: WebSocket not connected, message not sent!");
    return false;
  }

  // When the window opens it registers and therefore should be read
  registerMessageHandler(convID, handler) {
    this.messageHandlers.set(convID, handler);
    this.markConversationAsRead(convID);
  }

  unregisterMessageHandler(convID) {
    this.messageHandlers.delete(convID);
  }

  registerNotificationCallback(callback) {
    this.notificationCallbacks.push(callback);
  }

  registerOnlineCallbacks(callback) {
    this.onlineCallbacks.push(callback);
  }

  /**
   * Handles incoming WebSocket messages
   *
   * @param {Object} data - The message data received from the WebSocket server.
   */
  handleMessage(data) {
    const { online_users } = data;
    if (online_users) {
      this.triggerOnlineUpdate(online_users)
      return ;
    }  

    const convID = data.conversation_id;
    const message = data.message;

    this.updateConversationTracker(convID, {
      unreadCount: this.getUnreadCount(convID) + 1,
    });

    // This will check if there is someone subscribed (chat window open) and if it is use
    // its handler
    const handler = this.messageHandlers.get(convID);
    if (handler) {
      handler({ convID, message, isOwn: false });
      if (!chatWindowControler.isMinimized) {
        this.markConversationAsRead(convID, message);
      }
    } 
    this.triggerNotifications(convID);
  }

  updateConversationTracker(convID, data) {
    const existing = this.conversationTracker.get(convID) || {
      unreadCount: 0,
    };

    // this ... is a spread copy (shallow) and this makes so the
    // last value for the same key to be applied so it will replace the data if there
    // is and if not keep the existing
    this.conversationTracker.set(convID, {
      ...existing,
      ...data,
    });
  }

  getUnreadCount(convID) {
    const conv = this.conversationTracker.get(convID);
    return conv ? conv.unreadCount : 0;
  }

  markConversationAsRead(convID) {
    const conv = this.conversationTracker.get(convID);
    if (conv) {
      conv.unreadCount = 0;
      this.triggerNotifications(convID); // UI Update
    }
  }

  triggerNotifications(convID) {
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(convID);
      } catch (error) {
        console.log("DEBUG: Error in websocket notification callback:", error);
      }
    });
  }

  triggerOnlineUpdate(onlineFriends) {
    this.onlineCallbacks.forEach((callback) => {
      try {
        callback(onlineFriends);
      } catch (error) {
        console.log("DEBUG: Error in websocket OnlineUpdate callback:", error);
      }
    })
  }

  /**
   * Sends a chat message to a specified recipient via WebSocket.
   *
   * @param {string|number} conversationID - The unique identifier of the conversation.
   * @param {string} message - The content of the chat message to send.
   * @returns {boolean}
   */
  sendChatMessage(conversationID, message) {
    return this.send({
      conversation_id: conversationID,
      message: message,
    });
  }

}

export const webSocketService = new WebSocketService();

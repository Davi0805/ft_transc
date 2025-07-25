import { chatWindowControler } from "../components/chatWindow";
import { authService } from "../services/authService";

export interface ChatMessage {
  conversation_id: number;
  message: string;
}

export interface ReadEvent {
  type: "read_event";
  conversation_id: number;
}

export type FunctionCallback = (...args: any[]) => void;

export interface OnlineUsersEvent {
  online_users: Array<number>;
}

export interface NewFriendRequestEvent {
  // user_id: string; // sender id
  event: "new_friend_request";
}

export interface MessageDTO {
  conversation_id: number;
  message: string;
  metadata: string | null;
}

class WebSocketService {
  private ws: WebSocket | null;
  private isConnected: boolean;
  private reconnectAttempts: number;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private userID: number | null;

  // Message Handling
  public conversationTracker: Map<number, number>;
  private messageHandlers: Map<number, FunctionCallback>;
  private notificationCallbacks: FunctionCallback[];
  private onlineCallbacks: FunctionCallback[];
  private friendsUpdateCallbacks: FunctionCallback[];
  private newFriendRequestsCallbacks: FunctionCallback[];

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
    this.friendsUpdateCallbacks = [];
    this.newFriendRequestsCallbacks = [];
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
  connect(userID: number | null): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("DEBUG: WebSocket already connected");
      return;
    }

    this.userID = userID;
    this.ws = new WebSocket("ws://localhost:8081/ws", [
      `Bearer.${authService.getToken()}`,
    ]);

    this.ws.onopen = (ev: Event) => {
      console.log("DEBUG: WebSocket connected");
      this.isConnected = true;
    };
    this.ws.onmessage = (ev: MessageEvent) => {
      try {
        const data = JSON.parse(ev.data);
        this.handleMessage(data);
      } catch (error) {
        console.error("Error parsing websocket message");
      }
    };
    this.ws.onclose = (ev: CloseEvent) => {
      console.log("DEBUG: websocket closed:", ev.code, ev.reason);
      this.isConnected = false;
      this.ws = null;

      if (
        ev.code !== 1000 &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`DEBUG: Reconnection attempt ${this.reconnectAttempts}`);
          this.connect(userID);
        }, this.reconnectAttempts * this.reconnectDelay);
      }
    };
    this.ws.onerror = (error: Event) => {
      console.error("DEBUG: WebSocket error:", error);
      this.isConnected = false;
    };
  }

  /**
   * Closes the WebSocket connection.
   * - Closes with code 1000 (normal closure) and a reason.
   * - Resets the WebSocket instance and connection status.
   */
  disconnect(): void {
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
  send(data: ChatMessage | ReadEvent): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true; // sent successfully
    }
    console.log("DEBUG: WebSocket not connected, message not sent!");
    return false;
  }

  // When the window opens it registers and therefore should be read
  registerMessageHandler(convID: number, handler: FunctionCallback): void {
    this.messageHandlers.set(convID, handler);
    this.markConversationAsRead(convID);
  }

  unregisterMessageHandler(convID: number): void {
    this.messageHandlers.delete(convID);
  }

  registerNotificationCallback(callback: FunctionCallback): void {
    this.notificationCallbacks.push(callback);
  }

  registerOnlineCallbacks(callback: FunctionCallback): void {
    this.onlineCallbacks.push(callback);
  }

  registerFriendsUpdateCallbacks(callback: FunctionCallback): void {
    this.friendsUpdateCallbacks.push(callback);
  }

  registerFriendRequestsUpdate(callback: FunctionCallback): void {
    this.newFriendRequestsCallbacks.push(callback);
  }

  /**
   * Handles incoming WebSocket messages
   *
   * @param {Object} data - The message data received from the WebSocket server.
   */

  /*
  export interface OnlineUsersEvent{
    online_users: Array<number>;
  }
  
  export interface NewFriendRequestEvent {
    event: "new_friend_request"
  }

  export interface MessageDTO {
    conversation_id: number | string;
    message: string;
    metadata: string | null;
  } 

  */
  isOnlineUsersEvent(
    data: OnlineUsersEvent | NewFriendRequestEvent | MessageDTO
  ): data is OnlineUsersEvent {
    return (data as OnlineUsersEvent).online_users !== undefined;
  }

  isNewFriendRequestEvent(
    data: OnlineUsersEvent | NewFriendRequestEvent | MessageDTO
  ): data is NewFriendRequestEvent {
    return (data as NewFriendRequestEvent).event === "new_friend_request";
  }

  isMessageDTO(
    data: OnlineUsersEvent | NewFriendRequestEvent | MessageDTO
  ): data is MessageDTO {
    return (
      data &&
      typeof data === "object" &&
      "conversation_id" in data &&
      "message" in data &&
      typeof data.conversation_id === "number" &&
      typeof data.message === "string" &&
      (typeof data.metadata === "string" ||
        data.metadata === null ||
        data.metadata === undefined)
    );
  }

  handleMessage(
    data: OnlineUsersEvent | NewFriendRequestEvent | MessageDTO
  ): void {
    /*
      Event for online friends
      {online_users: Array<number> }
    */
    if (this.isOnlineUsersEvent(data)) {
      this.triggerOnlineUpdate(data.online_users);
      return;
    }

    /* 
    Event for new friend request
    Object { event: "new_friend_request" }
    */
    if (this.isNewFriendRequestEvent(data)) {
      this.triggerNewFriendRequest();
      return;
    }

    /*
      Object {  conversation_id: 9,
            message: "1",
            metadata: "newConversation" }
    */
    if (this.isMessageDTO(data)) {
      /* 
         Event for new friendship
         Object {  conversation_id: 9,
                   message: "1",
                   metadata: "newConversation" }
       */
      if (data.metadata === "newConversation") {
        this.triggerFriendsUpdate(data);
        return;
      }

      const convID = data.conversation_id;
      const message = data.message;

      this.updateConversationTracker(convID, this.getUnreadCount(convID) + 1);

      // This will check if there is someone subscribed (chat window open) and if it is use
      // its handler
      const handler = this.messageHandlers.get(convID);
      if (handler) {
        handler({ convID, message, isOwn: false });
        if (!chatWindowControler.isMinimized) {
          this.markConversationAsRead(convID);
        }
      }
      this.triggerNotifications(convID);
    }
  }

  updateConversationTracker(convID: number, unreadCount: number): void {
    this.conversationTracker.set(convID, unreadCount);
  }

  getUnreadCount(convID: number): number {
    const unreadCount = this.conversationTracker.get(convID);
    return unreadCount ?? 0;
  }

  markConversationAsRead(convID: number): void {
    this.conversationTracker.set(convID, 0); // unread messages
    this.triggerNotifications(convID); // UI Update
  }

  triggerNotifications(convID: number): void {
    this.notificationCallbacks.forEach((callback) => {
      try {
        callback(convID);
      } catch (error) {
        console.log("DEBUG: Error in websocket notification callback:", error);
      }
    });
  }

  triggerOnlineUpdate(onlineFriends: Array<number>): void {
    this.onlineCallbacks.forEach((callback) => {
      try {
        callback(onlineFriends);
      } catch (error) {
        console.log("DEBUG: Error in websocket OnlineUpdate callback:", error);
      }
    });
  }

  triggerFriendsUpdate(data: MessageDTO): void {
    this.friendsUpdateCallbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.log(
          "DEBUG: Error in websocket friendsUpdateCallbacks callback:",
          error
        );
      }
    });
  }

  triggerNewFriendRequest(): void {
    this.newFriendRequestsCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.log(
          "DEBUG: Error in websocket newFriendRequestsCallbacks callback:",
          error
        );
      }
    });
  }

  /**
   * Sends a chat message to a specified recipient via WebSocket.
   *
   * @param {number} convID - The unique identifier of the conversation.
   * @param {string} message - The content of the chat message to send.
   * @returns {boolean} - if the messages was really sent or not
   */
  sendChatMessage(convID: number, message: string) {
    return this.send({
      conversation_id: convID,
      message: message,
    });
  }
}

export const webSocketService = new WebSocketService();

import { ReadEvent, webSocketService } from "../services/webSocketService";
import {
  getMessagesByConvID,
  Message,
} from "../api/friends/chat/getConversationMessagesAPI";
import { authService } from "../services/authService";
import { Friend } from "./sidebar";
import { WarningPopup } from "../utils/popUpWarn";

export interface ChatWindowMessage {
  convID: number;
  message: string;
  isOwn: boolean;
}

class ChatWindow {
  private element: HTMLDivElement | null;

  private friendAvatar: string | null;
  private friendName: string | null;
  private friendID: number | null;
  private convID: number | null;
  private messages: Array<Message>;

  private isOpen: boolean;
  public isMinimized: boolean;

  constructor() {
    this.element = null;

    this.friendAvatar = null;
    this.friendName = null;
    this.friendID = null;
    this.convID = null;
    this.messages = [];

    this.isOpen = false;
    this.isMinimized = false;
  }

  async open(friend: Friend): Promise<void> {
    if (this.isOpen) {
      if (this.isMinimized) {
        this.toggleMinimize();
      }
      this.focus();
      return;
    }

    this.friendAvatar = friend.friendAvatar;
    this.friendName = friend.friendName;
    this.friendID = friend.friendID;
    this.convID = friend.convID;

    this.messages = await getMessagesByConvID(this.convID);

    webSocketService.registerMessageHandler(this.convID, (messageData) => {
      this.handleRecieveMessage(messageData);
    });

    this.isOpen = true;
    this.createElement();
    this.attachEventListeners();
    this.attachLastMessages();

    const chatWrapper = document.getElementById("chat-window-wrapper");
    if (chatWrapper) {
      chatWrapper.appendChild(this.element!);
    }
    const messageContainer = this.element?.querySelector(".chat-messages");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    this.focus();
  }

  focus(): void {
    if (this.element) {
      this.element.style.zIndex = "1000";
      const messageInput = this.element.querySelector(".message-input");
      if (messageInput instanceof HTMLInputElement) messageInput.focus();
    }
  }

  close(): void {
    if (!this.isOpen) return;

    if (this.convID) {
      webSocketService.unregisterMessageHandler(this.convID);
    }

    this.isOpen = false;

    // delete chat from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }

  createElement(): void {
    this.element = document.createElement("div");
    this.element.className = "chat-window";
    this.element.innerHTML = `
        <div class="chat-header">
            <img src="${this.friendAvatar}" width="30" height="30" alt="${this.friendName}">
            <span class="friend-name">${this.friendName}</span>
            <button class="minimize-btn">−</button>
            <button class="close-btn">×</button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input-container">
            <input type="text" class="message-input" placeholder="Type a message...">
            <button class="send-btn">Send</button>
        </div>
        `;
  }

  toggleMinimize(): void {
    if (!this.element || !authService.userID) return;
    this.element.style.height =
      this.element.style.height === "50px" ? "400px" : "50px";
    this.element.classList.toggle("minimized");
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized)
      authService.sidebar?.updateContactUnreadUI(authService.userID, 0);
  }

  attachEventListeners(): void {
    if (!this.element) return;
    const minimizeBtn = this.element.querySelector(".minimize-btn");
    const closeBtn = this.element.querySelector(".close-btn");
    const sendBtn = this.element.querySelector(".send-btn");
    const messageInput = this.element.querySelector(".message-input");

    minimizeBtn?.addEventListener("click", () => {
      this.toggleMinimize();
    });

    closeBtn?.addEventListener("click", () => {
      this.close();
    });

    sendBtn?.addEventListener("click", () => this.sendMessage());

    messageInput?.addEventListener("keydown", (e: Event) => {
      const event = e as KeyboardEvent;
      if (event.key === "Enter") this.sendMessage();
    });
  }

  // {
  // "id":1,
  //  "conversation_id":1,
  //  "from_user_id":1,
  //  "message_content":"Olá Maria!",
  //  "metadata":null
  // }
  attachLastMessages(): void {
    this.messages.forEach((message) => {
      this.addMessage({
        message: message.message_content,
        isOwn: message.from_user_id == authService.userID ? true : false,
      } as ChatWindowMessage);
    });
  }

  sendMessage(): void {
    if (!this.element || !authService.userID) {
      console.warn("DEBUG: Chat window element or user ID not found.");
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the chat window could not be found..."
      );
      return;
    } 
    const messageInput = this.element.querySelector(
      ".message-input"
    ) as HTMLInputElement;
    const message = messageInput.value.trim();

    if (!message) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the message could not be sent..."
      );
      return;
    }

    if (this.convID && webSocketService.sendChatMessage(this.convID, message)) {
      this.addMessage({
        message: message,
        isOwn: true,
      } as ChatWindowMessage);
      messageInput.value = ""; // clear
    } else {
      const errPopup = new WarningPopup();
      errPopup.create(
        "Error Sending Message",
        "Message was not able to be sent. Please refresh the page and try again."
      );
    }
  }

  /* 
    messageData { convID: 1,
                  message: "oi",
                  isOwn: false }
  */
  handleRecieveMessage(messageData: ChatWindowMessage): void {
    this.addMessage({
      message: messageData.message,
      isOwn: false,
    } as ChatWindowMessage);
    webSocketService.send({
      type: "read_event",
      conversation_id: messageData.convID,
    } as ReadEvent); // read trigger event
  }

  addMessage(messageData: ChatWindowMessage): void {
    const messageContainer = this.element?.querySelector(".chat-messages");
    if (!this.element || !messageContainer) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the message window could not be found..."
      );
      return;
    }

    const newMessage = document.createElement("div");
    newMessage.classList.add("message");

    if (messageData.isOwn) {
      newMessage.classList.add("isOwn");
    } else {
      newMessage.classList.add("notOwn");
    }

    newMessage.innerText = messageData.message;
    messageContainer.appendChild(newMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

export const chatWindowControler = new ChatWindow();

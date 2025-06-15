import { webSocketService } from "../services/webSocketService.js";
import { getMessagesByConvID } from "../api/getConversationMessages.js";
import { Chat } from "./sidebar.js";

class ChatWindow {
  constructor() {
    this.userID = webSocketService.userID;
    this.element = null;

    this.friendAvatar = null;
    this.friendName = null;
    this.friendID = null;
    this.convID = null;
    this.messages = [];

    this.isOpen = false;
  }

  /*friend {
      convID: conv.id,
      friendID: friendID,
      friendName: friendData.name,
      friendAvatar: friendAvatarURL 
    }*/
  // todo make it so only one is active at a time
  async open(friend) {
    if (this.isOpen) {
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
    chatWrapper.appendChild(this.element);
    const messageContainer = this.element.querySelector(".chat-messages");
    messageContainer.scrollTop = messageContainer.scrollHeight;;
    this.focus();
  }

  focus() {
    if (this.element) {
      this.element.style.zIndex = "1000";
      const messageInput = this.element.querySelector(".message-input");
      if (messageInput) messageInput.focus();
    }
  }

  close() {
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

  createElement() {
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

  attachEventListeners() {
    const minimizeBtn = this.element.querySelector(".minimize-btn");
    const closeBtn = this.element.querySelector(".close-btn");
    const sendBtn = this.element.querySelector(".send-btn");
    const messageInput = this.element.querySelector(".message-input");

    minimizeBtn.addEventListener("click", () => {
      this.element.style.height =
        this.element.style.height === "40px" ? "400px" : "40px";
    });

    closeBtn.addEventListener("click", () => {
      this.close();
    });

    sendBtn.addEventListener("click", () => this.sendMessage());

    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
  }

  // {
  // "id":1,
  //  "conversation_id":1,
  //  "from_user_id":1,
  //  "message_content":"Olá Maria!",
  //  "metadata":null
  // }
  attachLastMessages() {
    this.messages.forEach((message) => {
      this.addMessage({
        message: message.message_content,
        isOwn: message.from_user_id === this.userID ? true : false,
      });
    });
  }

  sendMessage() {
    const messageInput = this.element.querySelector(".message-input");
    const message = messageInput.value.trim();

    if (!message) return;

    if (webSocketService.sendChatMessage(this.convID, message)) {
      this.addMessage({
        message: message,
        isOwn: true,
      });
      messageInput.value = ""; // clear
    } else {
      console.log("DEBUG: Could not send message. Try again");
    }
  }

  handleRecieveMessage(messageData) {
    this.addMessage({
      message: messageData.message,
      isOwn: false,
    });
  }

  addMessage(messageData) {
    const messageContainer = this.element.querySelector(".chat-messages");
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");

    if (messageData.isOwn) {
      newMessage.style.background = "#007bff";
      newMessage.style.marginLeft = "auto";
      newMessage.style.textAlign = "right";
    } else {
      newMessage.style.background = "#00FF00";
      newMessage.style.marginRight = "auto";
    }
    newMessage.innerText = messageData.message;
    messageContainer.appendChild(newMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

export const chatWindowControler = new ChatWindow();

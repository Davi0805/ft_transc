import { webSocketService } from "../services/webSocketService.js";

class ChatWindow {
  constructor(friendID) {
    this.friendID = friendID;
    this.messages = [];
    this.isOpen = false;
    this.element = null;
    this.messageHandler = this.handleIncomingMessage.bind(this);

    webSocketService.onMessage("chat_message", this.messageHandler);
  }

  open() {
    if (this.isOpen) {
      this.focus();
      return;
    }
  }

  focus() {
    if (this.element) {
      this.element.style.zIndex = "1000";
      // TODO REPLACE selector
      const messageInput = this.element.querySelector(".message-input");
      if (messageInput) messageInput.focus();
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    webSocketService.offMessage("chat_message", this.messageHandler);

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
            <img src="${this.friend.avatar}" width="30" height="30" alt="${this.friend.name}">
            <span class="friend-name">${this.friend.name}</span>
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
    const minimizeBtn = this.element.querySelector('.minimze-btn');
    const closeBtn = this.element.querySelector('.close-btn');
    const sendBtn = this.element.querySelector('.send-btn');
    const messageInput = this.element.querySelector('.message-input');

    minimizeBtn.addEventListener('click', () => {
        this.element.style.height = this.element.style.height === '40px' ? '400px' : '40px';
    });

    closeBtn.addEventListener('click', () => {
        this.close();
    });

    sendBtn.addEventListener('click', this.sendMessage());

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            this.sendMessage();
    });
  }

  sendMessage() {
    const messageInput = this.element.querySelector('.message-input');
    const message = messageInput.ariaValueMax.trim();

    if (!message) return;

    if (webSocketService.sendChatMessage(this.friendID, message)) {
        this.addMessage({
            senderID: webSocketService.userID,
            message: message,
            timestamp: new Date().toISOString(),
            isOwn: true
        });
        messageInput.value = ""; // clear
    } else {
        console.log("DEBUG: Could not send message. Try again");
    }
  }

  handleIncomingMessage(data) {
    if (data.senderID === this.friendID) {
        this.addMessage({
            senderID: data.senderID,
            message: data.message,
            timestamp: data.timestamp,
            isOwn: false
        });
    }
  }

  addMessage(messageData) {
    const messageContainer = this.element.querySelector('.chat-messages');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    
    if (messageData.isOwn) {
        newMessage.style.background = '#007bff';
        newMessage.style.marginLeft = 'auto';
        newMessage.style.textAlign = 'right';
    } else {
        newMessage.style.background = 'white';
        newMessage.style.marginRight = 'auto';
    }

    const time = new Date(messageData.timestamp).toLocaleTimeString();
    newMessage.innerHTML = `
        <div>${messageData.message}</div>
        <small class="time">4{time}</small>
    `;
    
    messageContainer.appendChild(newMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

export const chatWindow = new ChatWindow();
import { ReadEvent, webSocketService } from "../services/webSocketService";
import {
  getMessagesByConvID,
  Message,
} from "../api/friends/chat/getConversationMessagesAPI";
import { authService } from "../services/authService";
import { Friend } from "./sidebar";
import { WarningPopup } from "../utils/popUpWarn";
import { PlayPage } from "../pages/play/play";
export interface ChatWindowMessage {
  convID: number;
  message: string;
  lobbyID: number;
  isOwn: boolean;
}

class ChatWindow {
  private element: HTMLDivElement | null;

  private friendAvatar: string | null;
  private friendName: string | null;
  private friendUsername: string | null;
  private friendID: number | null;
  private convID: number | null;
  private messages: Array<Message>;

  private isOpen: boolean;
  public isMinimized: boolean;

  constructor() {
    this.element = null;

    this.friendAvatar = null;
    this.friendName = null;
    this.friendUsername = null;

    this.friendID = null;

    this.convID = null;
    this.messages = [];

    this.isOpen = false;
    this.isMinimized = false;
  }

  get isChatOpen(): boolean {
    return this.isOpen;
  }

  get getFriendID(): number | null {
    return this.friendID;
  }

  async open(friend: Friend): Promise<void> {
    if (this.isOpen) {
      if (this.convID === friend.convID) {
        if (this.isMinimized) {
          this.toggleMinimize();
        } else {
          this.focus();
        }
        return;
      } else {
        this.close(); // close current chat if different conversation
      } 
    }

    this.friendAvatar = friend.friendAvatar;
    this.friendName = friend.friendName;
    this.friendID = friend.friendID;
    this.friendUsername = friend.friendUsername;
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
    this.isMinimized = false;

    // delete chat from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }

  createElement(): void {
    this.element = document.createElement("div");
    this.element.className = "chat-window animate-slideInUp";
    this.element.innerHTML = `
        <div class="chat-header">
            <img src="${this.friendAvatar}" width="30" height="30" alt="${this.friendName}">
            <a href="/profile/${this.friendID}" data-link class="friend-name">${this.friendName}</a>
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
    const minimizeBtn = this.element?.querySelector(".minimize-btn");
    const closeBtn = this.element?.querySelector(".close-btn");
    const sendBtn = this.element?.querySelector(".send-btn");
    const messageInput = this.element?.querySelector(".message-input");
    const messageContainer = this.element?.querySelector(".chat-messages");

    if (!this.element || !minimizeBtn || !closeBtn || !sendBtn || !messageInput || !messageContainer) {
      console.warn("DEBUG: Page did not load correclty.");
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly... Please refresh the page and try again."
      );
    }

    sendBtn?.addEventListener("click", () => this.sendMessage());

    minimizeBtn?.addEventListener("click", () => {
      this.toggleMinimize();
    });

    closeBtn?.addEventListener("click", () => {
      this.close();
    });


    messageInput?.addEventListener("keydown", (e: Event) => {
      const event = e as KeyboardEvent;
      if (event.key === "Enter") this.sendMessage();
    });

    messageContainer?.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      const lobbyID = Number(target.dataset.lobbyId);

      if (target.classList.contains("joinBtn")) {
        console.debug("Join Game button clicked.");
        PlayPage.goToLobby(lobbyID);
      }
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
        lobbyID: parseInt(message.metadata as string),
        isOwn: message.from_user_id == authService.userID ? true : false,
      } as ChatWindowMessage);
    });
  }

  sendMessage(): void {
    if (!this.element) {
      console.warn("DEBUG: Chat window element or user ID not found.");
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the chat window could not be found... Please refresh the page and try again."
      );
      return;
    } 
    const messageInput = this.element.querySelector(".message-input") as HTMLInputElement;
    const message = messageInput.value.trim();

    if (!message) {
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
                  lobbyID: 123,
                  isOwn: false }
  */
  handleRecieveMessage(messageData: ChatWindowMessage): void {
    this.addMessage(messageData);
    webSocketService.send({
      type: "read_event",
      conversation_id: messageData.convID,
    } as ReadEvent); // read trigger event
  }

  CreateInviteMessage(dataMessage: ChatWindowMessage): HTMLElement {
    const messageContainer = document.createElement("div");
    
    messageContainer.className = "relative mb-2 p-[8px_10px] rounded-xl max-w-[80%] break-words text-[14px] leading-[1.4]";
    
    if (dataMessage.isOwn) {
      messageContainer.classList.add(
        "bg-[linear-gradient(90deg,#627ec0,#314d8a)]",
        "rounded-br-[4px]",
        "text-[#eee]",
        "ml-auto"
      );
    } else {
      messageContainer.classList.add(
        "bg-[linear-gradient(90deg,#ffffff1a,#1c2333)]",
        "rounded-bl-[4px]",
        "text-[#eee]",
        "mr-auto"
      );
    }
    
    messageContainer.innerHTML = `
      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-2 pb-1.5 border-b border-[rgba(255,255,255,0.1)]">
          <div class="w-6 h-6 bg-[linear-gradient(135deg,#6e8ed7,#314d8a)] rounded flex items-center justify-center text-xs font-bold text-white">
            ♔
          </div>
          <div class="font-medium text-[#6e8ed7] text-[14px]">Pong Battle</div>
          <div class="text-[11px] text-[rgba(238,238,238,0.6)] ml-auto">Game Invite</div>
        </div>
        
        <!-- Description -->
        <div class="mb-3 text-[rgba(238,238,238,0.8)] text-[13px]" ">
          Join me for a quick match if you have the balls!
        </div>
        
        ${!dataMessage.isOwn ? `
        <!-- Play Button (only for received invitations) -->
        <button data-lobby-id="${dataMessage.lobbyID}" class="joinBtn w-full h-8 px-4 py-1.5 bg-[#6e8ed7] border-none rounded text-white text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-[#5a7bc4] active:scale-95">
          Join Game
        </button>
        ` : ''}
      </div>
    `;
    
    return messageContainer;
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

    if (messageData.lobbyID) {
      const inviteElement = this.CreateInviteMessage(messageData);
      messageContainer.appendChild(inviteElement);
      messageContainer.scrollTop = messageContainer.scrollHeight; 
      
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

  AddGameInviteMessage(lobbyID: number): void {
    if (!this.element) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the message window could not be found..."
      );
      return;
    }
    
    const messageContainer = this.element.querySelector(".chat-messages");
    if (!messageContainer) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the message container could not be found..."
      );
      return;
    }

    this.addMessage({ convID: this.convID!,
                   message: "",
                   lobbyID: lobbyID,
                   isOwn: true } as ChatWindowMessage);
  }
}

export const chatWindowControler = new ChatWindow();

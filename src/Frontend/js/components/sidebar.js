import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { getSelfConversations } from "../api/getSelfConversations.js";
import { authService } from "../services/authService.js";
import { webSocketService } from "../services/webSocketService.js";
import { chatWindowControler } from "./chatWindow.js";

export class Chat {
  constructor(userID) {
    this.sidebar = document.querySelector('aside');
    this.friends = [];
    this.minimized = false;
    this.userID = userID;
    this.token = null;

    this.contactElements = new Map();

    this.init();
  }

  async init() {
    this.sidebar.innerHTML = this.renderHTML;
    this.setToken();

    webSocketService.connect(this.token, this.userID);

    webSocketService.registerNotificationCallback((convID, messageData) => {
      this.handleNotification(convID, messageData);
    });

    webSocketService.registerOnlineCallbacks((online_users) => {
      this.handleRecieveOnlineUsers(online_users);
    });

    await this.getSidebarConversations();
    this.insertContactsOnSidebar();
  }
  
  renderHTML() {
    return `
      <div id="chat-sidebar" class="chat-sidebar content">
        <!-- Topbar with friend + search -->
        <div class="chat-sidebar-topbar">
          <button class="icon-btn">
            <img src="./Assets/icons/person-add.svg" alt="Add Friend" />
          </button>
          
          <div class="search-wrapper">
            <button class="icon-btn search-toggle">
              <img src="./Assets/icons/search.svg" alt="Search" />
            </button>
            
            <input type="text" class="search-input" placeholder="Search..." spellcheck="false" />
          </div>
        </div>
          
        <div class="chat-contacts-wrapper">
          <div class="chat-contacts"></div>
        </div>  
      </div>
        `;
  }

  async getSidebarConversations() {
    const convs = await getSelfConversations(this.token);
    if (convs.lenght == 0) return;

    for (const conv of convs) {
      const friendID =
        conv.user1_id === this.userID ? conv.user2_id : conv.user1_id;
      const friendData = await getUserDataById(friendID);
      let friendAvatarURL = await getUserAvatarById(friendID);

      if (!friendAvatarURL) friendAvatarURL = "./Assets/default/bobzao.jpg";

      this.friends.push({
        convID: conv.id,
        friendID: friendID,
        friendName: friendData.name,
        friendAvatar: friendAvatarURL,
        friendOn: false,
      });
    }
  }

  createContactElement(friendAvatar, friendName) {
    const newContact = document.createElement("button");
    newContact.className = "contact";
    newContact.innerHTML = `
            <button class="contact">
                <img src="${friendAvatar}" width="40px" height="40px">
                ${this.minimized ? "" : `<span>${friendName}</span>`}
                <span class="unread-badge" style="display: none;">0</span>
            </button>
            `;
    return newContact;
  }

  insertContactsOnSidebar() {
    const chatContacts = document.querySelector(".chat-contacts");
    this.friends.forEach((friend) => {
      const contactBtn = this.createContactElement(
        friend.friendAvatar,
        friend.friendName
      );

      contactBtn.addEventListener("click", () => {
        chatWindowControler.open(friend);
        this.updateContactUnreadUI(friend.convID, 0);
      });

      chatContacts.appendChild(contactBtn);

      this.contactElements.set(friend.convID, contactBtn);
    });
  }

  updateContactUnreadUI(convID, unreadCount) {
    const contactElement = this.contactElements.get(convID);
    if (contactElement) {
      const badge = contactElement.querySelector(".unread-badge");
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = "inline";
        contactElement.classList.add("has-unread");
      } else {
        badge.style.display = "none";
        contactElement.classList.remove("has-unread");
      }
    }
  }

  handleNotification(convID) {
    const unreadCount = webSocketService.getUnreadCount(convID);
    this.updateContactUnreadUI(convID, unreadCount);
  }

  /* {online_users: [2, 4, 6]} */
  handleRecieveOnlineUsers(onlineFriends) {
    this.friends.forEach((f) => {
      console.log(
        "DEBUG ANTES: Friend Name: " + f.friendName + " On: " + f.friendOn
      );
      f.friendOn = onlineFriends.includes(f.friendID) ? true : false;
      console.log(
        "DEBUG DEPOIS: Friend Name: " + f.friendName + " On: " + f.friendOn
      );
    });
  }

  setToken() {
    this.token = authService.getToken();
  }

  getToken() {
    return this.token;
  }
}

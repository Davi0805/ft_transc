import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { getSelfConversations } from "../api/getSelfConversations.js";
import { authService } from "../services/authService.js";
import { webSocketService } from "../services/webSocketService.js";
import { chatWindowControler } from "./chatWindow.js";

export class Chat {
  constructor(userID) {
    this.sidebar = document.querySelector("aside");
    this.friends = [];
    this.minimized = false;
    this.userID = userID;
    this.token = null;

    this.contactElements = new Map();

    this.init();
  }

  async init() {
    this.sidebar.innerHTML = this.renderHTML();
    this.setToken();

    webSocketService.connect(this.token, this.userID);

    webSocketService.registerNotificationCallback((convID) => {
      this.handleNotification(convID);
    });

    webSocketService.registerOnlineCallbacks((online_users) => {
      this.handleRecieveOnlineUsers(online_users);
    });

    await this.getSidebarConversations();
    this.insertContactsOnSidebar();
  }

  renderHTML() {
    return `
      <button id="toggle-sidebar" class="toggle-sidebar-btn icon-btn">
        <img src="./Assets/icons/arrow-right.svg" alt="Toggle" />
      </button>

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

  // this ensures there is no memory leaks and is considered better than just empty out the html
  // eventlisteners might cause some leaks if cleared that way
  deleteSideBar() {
    const newSidebar = this.sidebar.cloneNode(false); // false for a shallow copy
    this.sidebar.replaceWith(newSidebar);
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
              <button class="contact f-${friendName}">
                  <img src="${friendAvatar}" width="40px" height="40px">
                  ${this.minimized ? "" : `<span>${friendName}</span>`}
                  <span class="unread-badge" style="display: none;">0</span>
              </button>
              `;
    return newContact;
  }

  deleteContact(convID) {
    const entry = this.contactElements.get(convID);
    if (!entry) return;

    entry.element.removeEventListener("click", clickHandler);
    entry.element.remove();
    this.contactElements.delete(convID); // remove from element map
    this.friends.filter((f) => f.convID !== convID); // remove from friend array
  }

  insertContactsOnSidebar() {
    const chatContacts = document.querySelector(".chat-contacts");
    this.friends.forEach((friend) => {
      const contactBtn = this.createContactElement(
        friend.friendAvatar,
        friend.friendName
      );

      const clickHandler = () => {
        chatWindowControler.open(friend);
        this.updateContactUnreadUI(friend.convID, 0);
      };

      contactBtn.addEventListener("click", clickHandler);

      chatContacts.appendChild(contactBtn);

      this.contactElements.set(friend.convID, {
        element: contactBtn,
        handler: clickHandler,
      });
    });
  }

  updateContactUnreadUI(convID, unreadCount) {
    const contactElement = this.contactElements.get(convID).element;
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
      f.friendOn = onlineFriends.includes(f.friendID) ? true : false;

      if (f.friendOn) {
        const query = this.contactElements.get(f.convID);
        if (!query) return;
        const img = query.element.querySelector('img');
        if (!img) return;
        img.style.border = '2.3px solid #31be06';
        img.style.boxShadow = '0px 0px 4px #31be06';
      }
    });
  }

  setToken() {
    this.token = authService.getToken();
  }

  getToken() {
    return this.token;
  }
}

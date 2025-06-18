import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { getSelfConversations } from "../api/getSelfConversationsAPI.js";
import { getFriendRequests } from "../api/getFriendRequestsAPI.js";
import { authService } from "../services/authService.js";
import { webSocketService } from "../services/webSocketService.js";
import { chatWindowControler } from "./chatWindow.js";

// TODO ADICIONAR BUTTON COM FRIEND REQUEST E QUANTIDADE, EVENTHOOKS, OPEN, CLOSE, SHOW E O CARALHO
export class Chat {
  constructor(userID) {
    this.sidebar = document.querySelector("aside");
    this.friends = [];
    this.minimized = false;
    this.userID = userID;
    this.token = null;

    this.contactElements = new Map();
    this.friendRequests = [];

    this.init();
  }

  async init() {
    this.setToken();

    this.sidebar.innerHTML = this.renderHTML();
    this.attachHeaderEventListeners();

    this.friendRequests = await getFriendRequests();
    this.attachFriendRequestsButton();

    await this.getSidebarConversations();

    webSocketService.connect(this.token, this.userID);

    webSocketService.registerNotificationCallback((convID) => {
      this.handleNotification(convID);
    });

    webSocketService.registerOnlineCallbacks((online_users) => {
      this.handleRecieveOnlineUsers(online_users);
    });

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
          <button class="icon-btn add-friend">
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

  renderAddFriendHTML() {
    return `
      <dialog class="friend-requests-wrapper" id="friendRequestsDialog" >
        <button class="close-dialog-btn">&times;</button> <!-- onclick="closeDialog()" -->

        <h1 class="title friend-request-header">Friend Requests</h1>

        <div class="requests-container">

          
          <div class="request-wrapper">
            <div class="user-info">
              <img src="../../Assets/default/bobzao.jpg" alt="user-avatar" />

              <span>Artur</span>
            </div>

            <div class="request-options">
              <button class="request-btn" id="friend-accept" title="Accept">
                <img src="../../Assets/icons/check-circle.svg" />
              </button>

              <button class="request-btn" id="friend-reject" title="Reject">
                <img src="../../Assets/icons/cancel-circle.svg" />
              </button>

              <button class="request-btn" id="friend-block" title="Block">
                <img src="../../Assets/icons/block-circle.svg" />
              </button>
            </div>
          </div>

          
        </div>
      </dialog>
    `;
  }

  friendRequestEventListener() {}

  attachFriendRequestsButton() {
    if (this.friendRequests.length == 0) return;
    this.createFriendRequestsElement(this.friendRequests.length);
    const friendRequestBtn = document.getElementById("friend-requests-btn");
    if (!friendRequestBtn) return;
  }

  attachHeaderEventListeners() {
    const addBtn = document.querySelector(".chat-sidebar-topbar .add-friend");
    // const friendRequestBtn = document.querySelector(''); //todo
    const searchInput = document.querySelector(".search-wrapper input");
    const searchBtn = document.querySelector(".search-wrapper button");

    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();

        this.renderAddFriendHTML();
      });
    }
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
        unreadMsg: conv.unread_count,
        friendOn: false,
      });
    }
  }

  createContactElement(friendAvatar, friendName, unreadMsg) {
    const newContact = document.createElement("button");
    newContact.className = "contact";
    newContact.innerHTML = `
              <button class="contact f-${friendName}">
                  <img src="${friendAvatar}" width="40px" height="40px">
                  ${this.minimized ? "" : `<span>${friendName}</span>`}
                  <span class="unread-badge" style="display: ${
                    unreadMsg ? "inline" : "none"
                  };">${unreadMsg}</span>
              </button>
              `;
    return newContact;
  }

  createFriendRequestsElement(numfriendRequests) {
    const sidebar = document.getElementById('chat-sidebar');
    const contactsElement = document.querySelector('.chat-contacts-wrapper');
    if (!contactsElement) return;
    const friendRequestElement = document.createElement("div");
    friendRequestElement.className = "friend-requests-btn-wrapper";
    friendRequestElement.innerHTML = `
        <div class="friend-requests-btn-wrapper">
          <button class="friend-requests-btn icon-btn" id="friend-requests-btn">
            <span class="friend-requests-text">Friend Requests</span>
            <span class="friend-requests-count">${numfriendRequests}</span>
          </button>
        </div>
    `;
    const friendRequestBtn = friendRequestElement.querySelector("button");
    if (!friendRequestBtn) return;
    friendRequestBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.openFriendRequetsDialog();
    });
    sidebar.insertBefore(friendRequestBtn, contactsElement);
  }

  openFriendRequetsDialog() {
    if (document.getElementById("friendRequestsDialog")) return; // prevent doubling

    const dialogHTML = this.renderAddFriendHTML();
    document.body.insertAdjacentHTML("beforeend", dialogHTML);

    const dialog = document.getElementById("friendRequestsDialog");
    this.attachFriendRequetsDialogEventListeners(dialog);
    dialog.showModal();
  }

  attachFriendRequetsDialogEventListeners(dialog) {
    const closeBtn = dialog.querySelector(".close-dialog-btn");

    // Close dialog handler
    const closeHandler = () => {
      dialog.close();
      dialog.remove(); // Clean up from DOM
    };

    closeBtn.addEventListener("click", closeHandler);

    // Close on backdrop click
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        closeHandler();
      }
    });
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
        friend.friendName,
        friend.unreadMsg
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

      const query = this.contactElements.get(f.convID);
      if (!query) return;
      const img = query.element.querySelector("img");
      if (!img) return;

      if (f.friendOn) {
        img.style.border = "2.3px solid #31be06";
        img.style.boxShadow = "0px 0px 4px #31be06";
      } else {
        img.style.border = "2.3px solid #676768";
        img.style.boxShadow = "0px 0px 4px #676768";
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

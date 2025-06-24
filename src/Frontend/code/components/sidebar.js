import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { getSelfConversations } from "../api/getSelfConversationsAPI.js";
import { getFriendRequests } from "../api/getFriendRequestsAPI.js";
import { acceptFriendRequest } from "../api/acceptFriendRequestAPI.js";
import { rejectFriendRequest } from "../api/rejectFriendRequestAPI.js"
import { createFriendRequestByUsername } from "../api/createFriendRequestAPI.js"
import { authService } from "../services/authService.js";
import { webSocketService } from "../services/webSocketService.js";
import { chatWindowControler } from "./chatWindow.js";

export class Chat {
  constructor(userID) {
    this.sidebar = document.querySelector("aside");
    this.friends = [];
    this.userID = userID;
    this.token = null;

    this.friendRequests = null;
    this.friendRequestCount = 0;

    /* (convID, {element: contactBtn, handler: clickHandler }) */
    this.contactElements = new Map();

    this.init();
  }

  async init() {
    this.setToken();

    this.sidebar.innerHTML = this.renderHTML();
    await this.attachHeaderEventListeners();

    
    {
      /* 
      [ { "sender_id": 7,
          "request_id": 7,
          "sender_name": "sapo",
          "sender_username": "sapo" }, ...]
      */
      const reqArray = await getFriendRequests();
      this.friendRequestCount = reqArray.length;
      this.friendRequests = new Map(reqArray.map(req => [req.sender_username, req]));
    }
    
    this.updateFriendRequestsNumber(this.friendRequestCount);
    
    await this.getSidebarConversations();
    
    webSocketService.connect(this.token, this.userID);

    webSocketService.registerNotificationCallback((convID) => {
      this.handleNotification(convID);
    });

    webSocketService.registerOnlineCallbacks((online_users) => {
      this.handleRecieveOnlineUsers(online_users);
    });

    webSocketService.registerFriendsUpdateCallbacks((data) => {
      this.handleUpdateFriends(data);
    });


    /*
      conversation_id?
      message?:
      metadata: {user_id?: string = reciever_id?,
                event: "new_friend_request"}
  */
    webSocketService.registerFriendRequetsUpdate(() => {
      this.updateFriendRequestsNumber(this.friendRequestCount + 1);
      this.friendRequests.set()
    })

    this.insertContactsOnSidebar();
  }

  renderHTML() {
    return `
      <div id="chat-sidebar" class="chat-sidebar content">
        <!-- Topbar with friend + search -->

        <div class="chat-sidebar-topbar">
          <button class="icon-btn add-friend">
            <img src="./Assets/icons/person-add.svg" alt="Add Friend" />
          </button>
          
          <input type="text" class="search-input" placeholder="Search..." spellcheck="false" />
        </div>

        <div class="friend-requests-btn-wrapper">
          <button class="friend-requests-btn icon-btn" id="friend-requests-btn">
            <span class="friend-requests-text">Friend Requests</span>
            <span class="friend-requests-count">${this.friendRequestCount}</span>
          </button>
        </div>

        <div class="chat-contacts-wrapper">
          <div class="chat-contacts"></div>
        </div>  

      </div>

      <div id="add-friend-popover" class="add-friend-popover hidden">
        <input type="text" id="friend-username-input" placeholder="Username..." />
        <button id="send-friend-request-btn">Add</button>
      </div>  

        `;
  }

  renderFriendRequestsHTML() {
    return `
      <dialog class="friend-requests-wrapper" id="friendRequestsDialog" >
        <button class="close-dialog-btn">&times;</button> <!-- onclick="closeDialog()" -->

        <h1 class="title friend-request-header">Friend Requests</h1>

        <div class="requests-container"></div>
      </dialog>
    `;
  }

  async attachHeaderEventListeners() {


    // ADD FRIENDS
    const addFriendBtn = document.querySelector('.add-friend');
    const popover = document.getElementById('add-friend-popover');
    const popoverInput = document.getElementById('friend-username-input');
    const popoverSendBtn = document.getElementById('send-friend-request-btn');

    addFriendBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('hidden');
      if (popover.classList.contains('hidden')) 
        popoverInput.value = "";
      else
        popoverInput.focus();
    });

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && !addFriendBtn.contains(e.target)) {
        popover.classList.add('hidden');
        popoverInput.value = "";
      }
    });

    popoverSendBtn.addEventListener('click', async () => {
      const username = popoverInput.value.trim();
      if (username) {
        try {
          await createFriendRequestByUsername(username);
        } catch (error) {
          //TODO          
        }
        popoverInput.value = '';
        popover.classList.add('hidden');
      }
    });


    // SEARCH
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        e.preventDefault();

        this.contactElements.forEach(({element}) => {
          let value = searchInput.value;
          if (value === ""){
            element.style.display = "flex";
            return;
          } 
          const username = element.classList[1].slice(2).toLowerCase(); // skip the f-

          element.style.display = username.includes(value) ? "flex" : "none";
        })
      });
    }

    // FRIEND REQUESTS
    const friendRequestBtn = document.getElementById("friend-requests-btn");
    if (friendRequestBtn) {
      friendRequestBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await this.openFriendRequetsDialog();
      });
    }
  }

  // this ensures there is no memory leaks and is considered better than just empty out the html
  // eventlisteners might cause some leaks if cleared that way
  deleteSideBar() {
    this.sidebar.replaceWith(this.sidebar.cloneNode(false));
    this.sidebar.remove();
  }

  async getSidebarConversations() {
    const convs = await getSelfConversations(this.token);
    if (convs.length == 0) return;

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
    newContact.className= `contact f-${friendName}`;
    newContact.innerHTML = `
                  <img src="${friendAvatar}" width="40px" height="40px">
                  <span>${friendName}</span>
                  <span class="unread-badge" style="display: ${unreadMsg ? "inline" : "none"};">${unreadMsg}</span>
                  `;
    return newContact;
  }

  updateFriendRequestsNumber(number) {
    const count = this.sidebar.querySelector(".friend-requests-count");
    if (!count) return;
    count.textContent = `${number}`;
  }

  async createFriendRequestElement(friendRequest) {
    const newRequest = document.createElement("div");
    newRequest.classList = `request-wrapper ${friendRequest.sender_username}`;
    const requestAvatar = await getUserAvatarById(friendRequest.sender_id);
    newRequest.innerHTML = `
        <div class="user-info">
          <img src="${requestAvatar}" alt="user-avatar" />

          <span>${friendRequest.sender_name}</span>
        </div>

        <div class="request-options">
          <button class="request-btn accept" id="friend-accept" data-username="${friendRequest.sender_username}" title="Accept">
            <img src="../../Assets/icons/check-circle.svg" />
          </button>

          <button class="request-btn reject" id="friend-reject" data-username="${friendRequest.sender_username}" title="Reject">
            <img src="../../Assets/icons/cancel-circle.svg" />
          </button>
        </div>
    `;
    return newRequest;
  }

  async insertFriendRequests() {
    const requestsContainer = document.querySelector(".requests-container");
    if (!requestsContainer) return;

    requestsContainer.textContent = this.friendRequestCount ?
      "" : "No friend requests";

    for (const request of this.friendRequests.values()) {
      const element = await this.createFriendRequestElement(request);
      requestsContainer.appendChild(element);
    }
  }

  deleteFriendRequest(username) {
    const friendRequestElement = document.querySelector(`.${username}`);
    if (!friendRequestElement) return;

    friendRequestElement.remove();
    this.friendRequestCount--;
    this.friendRequests.delete(username);

    if (this.friendRequestCount == 0) {
      document.querySelector('.requests-container').textContent = "No friend requests";
    }
    this.updateFriendRequestsNumber(this.friendRequestCount);
  }

  async openFriendRequetsDialog() {
    if (document.getElementById("friendRequestsDialog")) return; // prevent doubling
    
    const dialogHTML = this.renderFriendRequestsHTML();
    document.body.insertAdjacentHTML("beforeend", dialogHTML);
    
    await this.insertFriendRequests();
    
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
        // if i click on something that is a child its not the dialog(backdrop is tho!)
        closeHandler();
      }
    });

    const requestsContainer = document.querySelector(".requests-container");
    requestsContainer.addEventListener("click", async (e) => {
      const btn = e.target.closest("button.request-btn");
      if (!btn) return; // click not on the button

      const username = btn.dataset.username;
      if (!username) return;

      if (btn.classList.contains('accept')) {
        await acceptFriendRequest(this.friendRequests.get(username).request_id);
      } else if (btn.classList.contains('reject')) {
        await rejectFriendRequest(this.friendRequests.get(username).request_id);
      }

      this.deleteFriendRequest(username);
    });
  }

  deleteContact(convID) {
    const entry = this.contactElements.get(convID);
    if (!entry) return;

    entry.element.removeEventListener("click", entry.clickHandler);
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

  // { conversation_id: conv_id,
  //   message: 'You now can talk with user ' + data.user1, metadata: 'newConversation'})); 
  async handleUpdateFriends(data) {
    console.log(data);
    const type = data.metadata;
    if (type === "newConversation") {
      const friendID = Number(data.message);
      const friendData = await getUserDataById(friendID);
      let friendAvatarURL = await getUserAvatarById(friendID);

      this.friends.push({
        convID: data.conversation_id,
        friendID: friendID,
        friendName: friendData.name,
        friendAvatar: friendAvatarURL,
        unreadMsg: 0,
        friendOn: false,
      });


      const friend = this.friends[this.friends.length - 1];
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

      const chatContacts = document.querySelector(".chat-contacts");
      chatContacts.appendChild(contactBtn);

      this.contactElements.set(friend.convID, {
        element: contactBtn,
        handler: clickHandler,
      });

    }
    else if (type === "remove") { } // todo remover amizade
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

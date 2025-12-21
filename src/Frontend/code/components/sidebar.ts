import { authService } from "../services/authService";
import { webSocketService, MessageDTO } from "../services/webSocketService";
import { chatWindowControler } from "./chatWindow";
import { UserData } from "../api/userData/types/UserDataType";
import { getUserDataById} from "../api/userData/getUserDataByIDAPI";
import { getUserAvatarById } from "../api/userData/getUserAvatarAPI";
import {
  getSelfConversations,
  Conversation,
} from "../api/friends/chat/getSelfConversationsAPI";
import {
  getFriendRequests,
  FriendRequest,
} from "../api/friends/getFriendRequestsAPI";
import { getFriendRequestsCount } from "../api/friends/getFriendRequestsCountAPI";

import { acceptFriendRequest } from "../api/friends/acceptFriendRequestAPI";
import { rejectFriendRequest } from "../api/friends/rejectFriendRequestAPI";
import { createFriendRequestByUsername } from "../api/friends/createFriendRequestAPI";

import { SuccessPopup } from "../utils/popUpSuccess";
import { ErrorPopup } from "../utils/popUpError";
import DOMPurify from "dompurify";

export interface Friend {
  convID: number;
  friendID: number;
  friendUsername: string;
  friendName: string;
  friendAvatar: string;
  unreadMsg: number;
  friendOn: boolean;
}

export interface ContactElement {
  element: HTMLButtonElement;
  handler: () => void;
}

export class Chat {
  private sidebar: HTMLElement;

  private friends: Array<Friend>;
  /* (convID, {element: contactBtn, handler: clickHandler }) */
  private contactElements: Map<number, ContactElement>;

  private friendRequestCount: number = 0;
  private friendRequests: Map<string, FriendRequest> = new Map();


  constructor() {
    this.sidebar = document.querySelector("aside") as HTMLElement;
    this.friends = [];


    this.contactElements = new Map();
  }

  async init(): Promise<void> {
    this.sidebar.innerHTML = DOMPurify.sanitize(this.renderHTML());
    await this.attachHeaderEventListeners();

    webSocketService.connect(authService.userID);

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
      metadata: { event: "new_friend_request" }
    */
    webSocketService.registerFriendRequestsUpdate(() => {
      this.updateFriendRequestsNumber(webSocketService.getFriendRequestCount());
    });


    try {
      this.friendRequestCount = await getFriendRequestsCount();
      webSocketService.setFriendRequestCount(this.friendRequestCount);
    } catch (error) {
      console.error("Error at Chat initialization", error);
      const errPopup = new ErrorPopup();
      errPopup.create("Error Getting Friend Requets", "Could not fetch your friend requests count. Please try again later.");
      // could check why and handle it individually
      authService.logout();
      return;
    }


    await this.getSidebarConversations();

    this.insertContactsOnSidebar();
  }
//todo add friend from class to id
  renderHTML(): string {
    return `
      <div id="chat-sidebar" class="chat-sidebar content overflow-hidden">
        <!-- Topbar with friend + search -->

        <div class="flex items-center gap-2 p-1 border-b-1 border-white/10 rounded-b-sm bg-abyssblue min-h-10">
          <button class="icon-btn add-friend"> 
            <img src="./Assets/icons/person-add.svg" alt="Add Friend" />
          </button>
          
          <input type="text" class="search-input" placeholder="Search..." spellcheck="false" />
        </div>

        <div class="p-0 m-0 border-b-1 border-white/10 bg-abyssblue transition-colors duration-300 ease">
          <button class="w-full justify-between py-1.5 px-2.5 border-none rounded-none text-myWhite text-sm font-medium flex items-center gap-2 overflow-hidden bg-abyssblue active:scale-95 filter hover:brightness-125 transition-all duration-400 ease-in" id="friend-requests-btn">
            <span class="friend-requests-text">Friend Requests</span>
            <span id="friend-requests-count" class="py-1 px-1.5 min-w-5 rounded-full text-sm leading-none font-bold text-myWhite text-center h-5 bg-[#007bff33]">${this.friendRequestCount}</span>
          </button>
        </div>

        <div class="chat-contacts-wrapper h-full relative overflow-hidden bg-gray-800 rounded-lg
                    before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-5 before:z-20 before:pointer-events-none before:bg-gradient-to-b before:from-gray-900/80 before:to-transparent
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:z-20 after:pointer-events-none after:bg-gradient-to-t after:from-gray-900 after:to-transparent">
          <div class="chat-contacts h-full overflow-y-auto flex flex-col gap-2.5 py-2.5 px-1.5"></div>
        </div> 

      </div>

      <div id="add-friend-popover" class="flex items-center fixed top-[60px] right-[200px] z-50 p-[5px] w-[200px] min-h-8 gap-1.5 bg-abyssblue border-1 border-r-0 border-white/10 rounded-tl-lg rounded-bl-lg shadow-lg shadow-black/30 opacity-0 transition-all duration-150 ease-in-out">
        <input type="text" id="friend-username-input" class="outline-none flex-1 py-1 px-1.5 h-7 min-w-0 bg-white/5 border-1 border-white/10 rounded text-myWhite text-sm"  placeholder="Username..." />
        <button id="send-friend-request-btn" class="flex items-center justify-center w-9 h-7 p-1 text-myWhite text-sm font-medium cursor-pointer rounded bg-[#007bff33] hover:bg-[#007bff59] transition-colors duration-200 ease-in-out ">Add</button>
      </div>  

        `;
  }

  renderFriendRequestsHTML(): string {
    return `
      <dialog class="friend-requests-wrapper" id="friendRequestsDialog" >
        <button class="close-dialog-btn">&times;</button> <!-- onclick="closeDialog()" -->

        <h1 class="friend-request-header">Friend Requests</h1>

        <div class="requests-container"></div>
      </dialog>
    `;
  }

  async addFriendEventListener(): Promise<void> {
    const addFriendBtn = document.querySelector(
      ".add-friend"
    ) as HTMLButtonElement;
    const popover = document.getElementById(
      "add-friend-popover"
    ) as HTMLDivElement;
    const popoverInput = document.getElementById(
      "friend-username-input"
    ) as HTMLInputElement;
    const popoverSendBtn = document.getElementById(
      "send-friend-request-btn"
    ) as HTMLButtonElement;

    addFriendBtn.addEventListener("click", (e: MouseEvent) => {
      e.stopPropagation();
      popover.classList.replace("opacity-0", "opacity-100");
      if (popover.classList.contains("opacity-0")) popoverInput.value = "";
      else popoverInput.focus();
    });

    document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!popover.contains(target) && !addFriendBtn.contains(target)) {
        popover.classList.replace("opacity-100", "opacity-0");
        popoverInput.value = "";
      }
    });

    const sendFriendRequest = async () => {
      const username: string = popoverInput.value.trim();
      if (username) {
        try {
          await createFriendRequestByUsername(username);
          const sucPopup = new SuccessPopup();
          sucPopup.create(
            "Friend Request Sent",
            "Your friend request has been sent!"
          );
        } catch (error) {
          console.error(`DEBUG: Could not create friend request\n`, error);
          const errPopup = new ErrorPopup();
          errPopup.create(
            "Friend Request Error",
            "Could not find anyone with that username"
          );
        }
        popoverInput.value = "";
        popover.classList.add("hidden");
      }
    };

    popoverSendBtn.addEventListener("click", sendFriendRequest);

    popoverInput.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        sendFriendRequest();
      }
    });
  }

  searchFriendEventListener(): void {
    const searchInput = document.querySelector(".search-input");
    if (searchInput instanceof HTMLInputElement) {
      searchInput.addEventListener("input", (e: Event) => {
        e.preventDefault();

        this.contactElements.forEach(({ element }) => {
          let value = searchInput.value;
          if (value === "") {
            // reset
            element.style.display = "flex";
            return;
          }
          const username = element.dataset.friend; // skip the f- from class name

          element.style.display = username?.includes(value) ? "flex" : "none";
        });
      });
    }
  }

  async friendRequestEventListener(): Promise<void> {
    const friendRequestBtn = document.getElementById(
      "friend-requests-btn"
    ) as HTMLButtonElement;
    if (friendRequestBtn) {
      friendRequestBtn.addEventListener("click", async (e: MouseEvent) => {
        e.preventDefault();
        await this.openFriendRequetsDialog();
      });
    }
  }

  async attachHeaderEventListeners(): Promise<void> {
    // ADD FRIENDS
    await this.addFriendEventListener();

    // SEARCH
    this.searchFriendEventListener();

    // FRIEND REQUESTS
    await this.friendRequestEventListener();
  }

  // this ensures there is no memory leaks and is considered better than just empty out the html
  // eventlisteners might cause some leaks if cleared that way
  deleteSideBar(): void {
    this.sidebar.replaceWith(this.sidebar.cloneNode(false));
    this.sidebar.remove();
  }

  async getSidebarConversations(): Promise<void> {
    let convs: Conversation[];
    try {
      convs = await getSelfConversations();
      if (convs.length == 0) return;
    } catch (error) {
      console.error("Error getting conversations", error);
      authService.logout();
      // could be improved
      return;
    }

    for (const conv of convs) {
      const friendID =
        conv.user1_id === authService.userID ? conv.user2_id : conv.user1_id;
      try {
        const friendData = await getUserDataById(friendID);
        const friendAvatarURL = await getUserAvatarById(friendID);

        this.friends.push({
          convID: conv.id,
          friendID: friendID,
          friendName: friendData.nickname,
          friendUsername: friendData.username,
          friendAvatar: friendAvatarURL,
          unreadMsg: conv.unread_count,
          friendOn: false,
        });

        // conversationTracker initialization
        webSocketService.conversationTracker.set(conv.id, conv.unread_count);
      } catch (error) {
        console.error("DEBUG: Error getting friend on sidebar", error);
        // just skip it. could be improved
      }
    }
  }

  createContactElement(
    friendAvatar: string,
    friendName: string,
    unreadMsg: number
  ): HTMLButtonElement {
    const newContact = document.createElement("button") as HTMLButtonElement;
    newContact.setAttribute("data-friend", DOMPurify.sanitize(friendName));
    newContact.className = `contact hover:bg-[#007bff33] hover:scale-105 transition-all duration-200 ease-in-out active:scale-95`;
    newContact.innerHTML = DOMPurify.sanitize(`
                  <img class="rounded-full w-10 h-10 border-2 border-[#676768]" src="${friendAvatar}" width="40px" height="40px">
                  <span>${friendName}</span>
                  <span class="unread-badge -top-0.5 -right-0.5 absolute min-w-[18px] h-[18px] px-1 text-center text-xs font-bold text-myWhite
                bg-gradient-to-br from-red-500 to-red-400 rounded-full border-2 border-black/80 
                shadow-[0_0_4px_rgba(255,71,87,0.4),0_0_6px_rgba(255,71,87,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)]" style="display: ${
                    unreadMsg ? "inline" : "none"
                  };">${unreadMsg}</span>
                  `);
    return newContact;
  }

  updateFriendRequestsNumber(number: number): void {
    const count = document.getElementById("friend-requests-count");
    if (!(count instanceof HTMLSpanElement)) return;
    count.textContent = `${number}`;
  }

  async createFriendRequestElement(
    friendRequest: FriendRequest
  ): Promise<HTMLDivElement> {
    const newRequest = document.createElement("div") as HTMLDivElement;
    newRequest.classList = `request-wrapper ${friendRequest.sender_username}`;
    const requestAvatar = await getUserAvatarById(friendRequest.sender_id);
    newRequest.innerHTML = DOMPurify.sanitize(`
        <div class="user-info">
          <img src="${requestAvatar}" alt="user-avatar" />

          <span>${friendRequest.sender_name}</span>
        </div>

        <div class="request-options">
          <button class="request-btn accept" id="friend-accept" data-username="${DOMPurify.sanitize(friendRequest.sender_username)}" title="Accept">
            <img src="../../Assets/icons/check-circle.svg" />
          </button>

          <button class="request-btn reject" id="friend-reject" data-username="${DOMPurify.sanitize(friendRequest.sender_username)}" title="Reject">
            <img src="../../Assets/icons/cancel-circle.svg" />
          </button>
        </div>
    `);
    return newRequest;
  }

  async insertFriendRequests(): Promise<void> {
    const requestsContainer = document.querySelector(".requests-container");
    if (!(requestsContainer instanceof HTMLDivElement)) return;

    this.friendRequests.clear(); // clear old data
    // fetch new friend requests
    //todo trycatch
    const friendRequests: FriendRequest[] = await getFriendRequests();
    
    friendRequests.forEach(async (request) => {
      this.friendRequests.set(request.sender_username, request);
      const element = await this.createFriendRequestElement(request);
      requestsContainer.appendChild(element);
    });
  }

  deleteFriendRequest(username: string): void {
    const friendRequestElement = document.querySelector(
      `.request-wrapper.${username}`
    );
    if (!(friendRequestElement instanceof HTMLDivElement)) return;

    friendRequestElement.remove();
    this.friendRequests?.delete(username);

    if (webSocketService.getFriendRequestCount() === 0) {
      const reqContainer = document.querySelector(".requests-container");
      if (reqContainer instanceof HTMLDivElement) {
        reqContainer.textContent = "No friend requests";
      }
    }

    webSocketService.decrementFriendRequestCount();
  }

  async openFriendRequetsDialog(): Promise<void> {
    if (document.getElementById("friendRequestsDialog")) return; // prevent doubling

    const dialogHTML = this.renderFriendRequestsHTML();
    document.body.insertAdjacentHTML("beforeend", dialogHTML);

    await this.insertFriendRequests();

    const dialog = document.getElementById("friendRequestsDialog");
    if (dialog instanceof HTMLDialogElement) {
      this.attachFriendRequetsDialogEventListeners(dialog);
      dialog.showModal();
    }
  }

  attachFriendRequetsDialogEventListeners(dialog: HTMLDialogElement): void {
    const closeBtn = dialog.querySelector(".close-dialog-btn");
    // Close dialog handler
    const closeHandler = () => {
      dialog.close();
      dialog.remove(); // Clean up from DOM
    };

    if (closeBtn instanceof HTMLButtonElement) {
      closeBtn.addEventListener("click", closeHandler);
    }

    // Close on backdrop click
    dialog.addEventListener("click", (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const clickInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!clickInside) {
        closeHandler();
      }
    });

    // esc key closes dialog
    dialog.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeHandler();
      }
    });


    const requestsContainer = document.querySelector(".requests-container");
    if (requestsContainer instanceof HTMLDivElement) {
      requestsContainer.addEventListener("click", async (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const btn = target.closest("button.request-btn");
        if (!(btn instanceof HTMLButtonElement)) return; // click not on the button

        const username = btn.dataset.username;
        if (!username) return;

        const request = this.friendRequests.get(username);
        if (!request) return;

        try {
          if (btn.classList.contains("accept")) {
            await acceptFriendRequest(request.request_id);
          } else if (btn.classList.contains("reject")) {
            await rejectFriendRequest(request.request_id);
          }

          this.deleteFriendRequest(username);
        } catch (error) {
          console.error("Error: could not handle friend request action", error);
          // could implement better error handling
          authService.logout();
          return;
        }
      });
    }
  }

  deleteContact(convID: number): void {
    const entry = this.contactElements.get(convID);
    if (!entry) return;

    entry.element.removeEventListener("click", entry.handler);
    entry.element.remove();
    this.contactElements.delete(convID); // remove from element map
    this.friends.filter((f) => f.convID !== convID); // remove from friend array
  }

  insertContactsOnSidebar(): void {
    const chatContacts = document.querySelector(".chat-contacts");
    if (chatContacts instanceof HTMLDivElement) {
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
  }

  async handleUpdateFriends(data: MessageDTO): Promise<void> {
    if (data.metadata === "newConversation") {
      const friendID: number = Number(data.message);
      try {
        const friendData: UserData = await getUserDataById(friendID);
        let friendAvatarURL: string = await getUserAvatarById(friendID);

        this.friends.push({
          convID: data.conversation_id,
          friendID: friendID,
          friendName: friendData.nickname,
          friendAvatar: friendAvatarURL,
          unreadMsg: 0,
          friendOn: false,
        } as Friend);

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
        chatContacts?.appendChild(contactBtn);

        this.contactElements.set(friend.convID, {
          element: contactBtn,
          handler: clickHandler,
        });

        webSocketService.conversationTracker.set(friend.convID, 0);
        // else if (type === "remove") { } // todo remover amizade
      } catch (error) {
        console.error("Error getting new conversation with new friend", error);
        //could implement better error handling
        authService.logout();
        return;
      }
    }
  }

  updateContactUnreadUI(convID: number, unreadCount: number): void {
    if (!this.contactElements) return;
    const contactElement = this.contactElements.get(convID)?.element;
    if (contactElement) {
      const badge = contactElement.querySelector(".unread-badge");
      if (badge instanceof HTMLSpanElement) {
        if (unreadCount > 0) {
          badge.textContent = `${unreadCount}`;
          badge.style.display = "inline";
          contactElement.classList.add("has-unread");
        } else {
          badge.style.display = "none";
          contactElement.classList.remove("has-unread");
        }
      }
    }
  }

  handleNotification(convID: number): void {
    const unreadCount = webSocketService.getUnreadCount(convID);
    this.updateContactUnreadUI(convID, unreadCount);
  }

  /* {online_users: [2, 4, 6]} */
  handleRecieveOnlineUsers(onlineFriends: Array<number>) {
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

  // returns null if not found
  // returns conversation ID
  getConvIDByFriendID(friendID: number): number | null {
    const friend = this.friends.find((f) => f.friendID === friendID);
    return friend ? friend.convID : null;
  }

  // returns null if not found
  // returns conversation ID
  getConvIDByFriendUsername(friendUsername: string): number | null {
    const friend = this.friends.find((f) => f.friendName === friendUsername);
    return friend ? friend.convID : null;
  }
}

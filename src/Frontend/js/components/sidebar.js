import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { getSelfConversations } from "../api/getSelfConversations.js"
import { authService } from "../services/authService.js";
import { webSocketService } from "../services/webSocketService.js";
import { chatWindowControler } from "./chatWindow.js";

export class Chat {
    constructor(userID) {
        this.friends = [];
        this.minimized = false;
        this.userID = userID;
        this.init();
    }

    async init() {
        this.setToken();

        webSocketService.connect(this.token, this.userID);
        await this.getSidebarConversations();
        this.insertContactsOnSidebar(); 
    }
    
    async getSidebarConversations() {
        const convs = await getSelfConversations(this.token);
        if (convs.lenght == 0) return;

        for (const conv of convs) {

            const friendID = conv.user1_id === this.userID ? conv.user2_id : conv.user1_id ;
            const friendData = await getUserDataById(friendID);
            let friendAvatarURL = await getUserAvatarById(friendID);

            if (!friendAvatarURL) 
                friendAvatarURL = "./Assets/default/bobzao.jpg"

            this.friends.push({ 
                convID: conv.id,
                friendID: friendID,
                friendName: friendData.name,
                friendAvatar: friendAvatarURL
            });
        }
    }

    createContactElement(friendAvatar, friendName) {
        const newContact = document.createElement("button");
        newContact.className = "contact";
        newContact.innerHTML = `
            <button class="contact">
                <img src="${friendAvatar}" width="40px" height="40px">
                ${ this.minimized  ? "" : `<span>${friendName}</span>` }
            </button>
            `
        return newContact;
    }

    insertContactsOnSidebar() {

        const chatContacts = document.querySelector('.chat-contacts');
        this.friends.forEach(friend => {
            const contactBtn = this.createContactElement(friend.friendAvatar, friend.friendName);

            contactBtn.addEventListener('click', () => {
                chatWindowControler.open(friend);
            });

            chatContacts.appendChild(contactBtn);
        });
    }

    setToken() {
        this.token = authService.getToken();
    }

    getToken() {
        return this.token;
    }
}




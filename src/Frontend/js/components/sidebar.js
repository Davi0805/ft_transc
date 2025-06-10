import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { getSelfConversations } from "../api/getSelfConversations.js"
import { authService } from "../services/authService.js";
import { webSocketService } from "../services/webSocketService.js";
import { ChatWindow } from "./chatWindow.js";

export class Chat {
    constructor(userID) {
        this.friends = [];
        this.minimized = false;
        this.openChatWindows = new Map();
        this.userID = userID;
        this.init();
    }

    async init() {
        this.setToken();
        console.log('aqui1')

        webSocketService.connect(this.token, this.userID);
        console.log('aqui2')
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
                friendID: friendID,
                friendName: friendData.name,
                friendAvatar: friendAvatarURL
            });
        }
    }

    insertContactsOnSidebar() {

        const chatContacts = document.querySelector('.chat-contacts');
        this.friends.forEach(user => {
            const contactBtn = document.createElement('button');
            contactBtn.className = 'contact';
            contactBtn.innerHTML =  `
                <button class="contact">
                    <img src="${user.friendAvatar}" width="40px" height="40px">
                    ${ this.minimized  ? "" : `<span>${user.friendName}</span>` }
                </button>
            `;

            contactBtn.addEventListener('click', () => {
                this.openChatWindow(user);
            });

            chatContacts.appendChild(contactBtn);
        });
    }

    openChatWindow(friend) {
        if (this.openChatWindows.has(friend.friendID)) {
            this.openChatWindows.get(friend.friendID).focus();
            return ;
        }

        const chatWindow = new ChatWindow(friend.friendID);
        chatWindow.open();

        const originalClose = chatWindow.close.bind(chatWindow);
        chatWindow.close = () => {
            this.openChatWindows.delete(friend.friendID);
            originalClose();
        };
    }

    setMinimized(value) {
        this.minimized = value;
    }

    getMinimized() {
        return this.minimized;
    }

    setToken() {
        this.token = authService.getToken();
    }

    getToken() {
        return this.token;
    }
}




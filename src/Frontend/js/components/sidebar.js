import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { authService } from "../services/authService.js";
import { webSocketService } from "../services/webSocketService.js";
export class Chat {
    constructor(userID) {
        this.friends = [];
        this.minimized = false;
        this.openChatWindows = new Map();
        this.userID = userID;
    }

    async init() {
        this.setToken();

        webSocketService.connect(this.token, this.userID);

        await this.getSidebarConversations();
        this.insertContactsOnSidebar();
    }
    
    async getSidebarConversations() {
        const convs = getSelfConversations(this.token);
        if (convs.lenght == 0) return;

        for (const conv of convs) {

            const friendData = await getUserDataById(authService.getToken(), conv.friend_id);
            let friendAvatarURL = await getUserAvatarById(authService.getToken(), conv.friend_id);

            if (!friendAvatarURL) 
                friendAvatarURL = "./Assets/default/bobzao.jpg"

            this.friends.push({ 
                friendID: conv.friend_id,
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
                    <img src="${user.avatar}" width="40px" height="40px">
                    ${ this.minimized ? `<span>${user.name}</span>` : "" }
                </button>
            `;

            contactBtn.addEventListener('click', () => {
                this.openChatWindow(user);
            });

            chatContacts.appendChild(contactBtn);
        });
    }

    openChatWindow(friend) {
        if (this.openChatWindows.has(friend.id)) {
            this.openChatWindows.get(friend.id).focus();
            return ;
        }

        const chatWindow = new ChatWindow(friend);
        chatWindow.open();

        const originalClose = chatWindow.close.bind(chatWindow);
        chatWindow.close = () => {
            this.openChatWindows.delete(friend.id);
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




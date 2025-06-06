import { getUserDataById } from "../api/getUserDataAPI.js";
import { getUserAvatarById } from "../api/getUserAvatarAPI.js";
import { authService } from "../services/authService.js";

class Chat {
    constructor() {
        this.users = [];
        this.minimized = false;
    }

    async getSidebarConversations() {
        const convs = getSelfConversations(this.token);
        if (convs.lenght == 0) return;

        for (const conv of convs) {

            const friendData = await getUserDataById(authService.getToken(), conv.friend_id);

            let friendAvatarURL = await getUserAvatarById(authService.getToken(), conv.friend_id);
            if (!friendAvatarURL) friendAvatarURL = "./Assets/default/bobzao.jpg"

            this.users.push({ name: friendData.name, avatar: imgURL });
        }
    }

    insertContactsOnSidebar() {

        const chatContacts = document.querySelector('.chat-contacts');
        this.users.forEach(user => {
            chatContacts.insertAdjacentHTML('beforeend', `
                <button class="contact">
                    <img src="${user.avatar}" width="40px" height="40px">
                    ${ this.minimized ? `<span>${user.name}</span>` : "" }
                </button>
                `);
        });
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

export Chat chatService;



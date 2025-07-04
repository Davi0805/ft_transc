import "../css/tailwind.css"
import "../css/style.css"
import "../css/components/utils.css"
import "../css/login/login.css"
import "../css/login/twoFactor.css"
import "../css/register/register.css"
import "../css/header/header.css"
import "../css/sidebar/chat.css"
import "../css/sidebar/sidebar.css"
import "../css/sidebar/friend-requests.css"

import { authService } from "./services/authService";
import { header } from "./components/header"
import { router } from "./routes/router";

document.addEventListener('DOMContentLoaded', async () => {
    await authService.init();
    header.init()
    router.init();
});

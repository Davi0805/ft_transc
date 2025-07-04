import { authService } from "./services/authService";
import { header } from "./components/header"
import { router } from "./routes/router";

document.addEventListener('DOMContentLoaded', async () => {
    await authService.init();
    header.init()
    router.init();
});

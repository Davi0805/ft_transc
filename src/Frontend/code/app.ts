import { router } from "./routes/router";
import { authService } from "./services/authService";
import { header } from "./components/header"

document.addEventListener('DOMContentLoaded', async () => {
    await authService.init();
});

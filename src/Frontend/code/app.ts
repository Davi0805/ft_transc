import "../css/tailwind.css";

import { authService } from "./services/authService";
import { header } from "./components/header";
import { router } from "./routes/router";
import { InitialLoader } from "./components/loaders/initialLoader";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize the initial loader
  // This will display the loader until the app is fully initialized
  const initialLoader = InitialLoader.getInstance();
  
  header.init();
  await authService.init();
  router.init();
  
  initialLoader.removeLoader();
});

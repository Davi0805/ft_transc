import { togglePasswordVisibility } from "../../utils/domUtils";
import { TwoFactorAuth } from "./twoFactorAuth";
import { login, LoginState } from "../../api/login/loginAPI";
import { authService } from "../../services/authService";
import { router } from "../../routes/router";
import { ErrorPopup } from "../../utils/popUpError";

export const LoginPage = {
  template(): string {
    return `
        <div id="log-wrapper" class ="w-420 content">
          <form id="login-form">
            <h1 class="title" data-i18n="login-title">Login</h1>
            <div class="input-box">
              <input id="username" type="text" name="username" 
              autocomplete="username"
              data-i18n-placeholder="login-place-username" 
              required
              pattern="^[a-zA-Z0-9_\\-]{3,15}$" 
              title="Username must be 3-15 characters long and can include letters, numbers, '_' or '-'" 
              />
              <img src="../Assets/icons/user.svg" draggable="false"/>
            </div>
            <div class="input-box">
              <input id="password" type="password" name="password" autocomplete="current-password" data-i18n-placeholder="login-place-password" required />
              <img class="visibility" src="../Assets/icons/visibility-on.svg" draggable="false" />
            </div>

            <div id="login-error" class="-mt-4 align-center h-6 text-red-500 font-semibold text-center mb-3.5 invisible"></div>

            <button type="submit" class="button active:bg-[#bdbdbd]" data-i18n="login-btn"></button>

            <div class="register-link text-center text-sm mt-5 mb-3.5 mx-0 ">
              <p>
                <span data-i18n="login-register">Don't have an account?</span>
                <a href="/register" class="text-white font-semibold no-underline active:no-underline visited:no-underline" data-link data-i18n="login-register-link">Register</a>
              </p>
          </form>
        </div>

        `;
  },

  init(): void {
    togglePasswordVisibility();

    const form = document.getElementById("login-form") as HTMLFormElement;
    form.addEventListener("submit", this.handleSubmit);
  },

  async handleSubmit(e: Event) {
    e.preventDefault(); // prevent default browser action

    // Input
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response: LoginState = await login({ username, password });

      if (!response.verified) {
        await TwoFactorAuth.show(response.token); // error checking for this inside
        authService.setHas2FA(true);
        return;
      }

      authService.login(response.token);
      const redirectPath = authService.getRedirectAfterLogin();
      router.navigateTo(redirectPath);
    } catch (error) {
      if ((error as any).status == 401) {
        const loginError = document.getElementById(
          "login-error"
        ) as HTMLElement;
        loginError.textContent = "Username or password incorrect!";
        loginError.classList.remove("invisible");
        loginError.classList.add("visible");
        console.error("DEBUG Pass ou user wrong");
      } else {
        console.error("DEBUG: Something went wrong:", (error as any)?.message);

        const errPopup = new ErrorPopup();
        errPopup.create(
          "Error Logging In",
          "Something went wrong while trying to log in. Refresh and try again."
        );
      }
    }
    return;
  },
} as const;

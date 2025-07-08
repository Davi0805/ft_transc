import { togglePasswordVisibility } from "../../utils/domUtils";
import { TwoFactorAuth } from "./twoFactorAuth";
import { login, LoginState } from "../../api/loginAPI";
import { authService } from "../../services/authService";
import { router } from "../../routes/router";

export const LoginPage = {
  template(): string {
    return `
      <div id="log-wrapper" class="loggin-wrapper">
      <div class = content>
        <form id="login-form">
          <h1 class="title" data-i18n="login-title">Login</h1>
          <div class="input-box">
            <input id="username" type="text" name="username" data-i18n-placeholder="login-place-username" required/>
            <img src="../Assets/icons/user.svg" draggable="false"/>
          </div>
          <div class="input-box">
            <input id="password" type="password" name="password" data-i18n-placeholder="login-place-password" required />
            <img class="visibility" src="../Assets/icons/visibility-on.svg" draggable="false" />
          </div>

          <div id="login-error" aria-live="polite" hidden></div>

          <button type="submit" class="button" data-i18n="login-btn"></button>

          <div class="register-link">
            <p>
              <span data-i18n="login-register">Don't have an account?</span>
              <a href="/register" data-link data-i18n="login-register-link">Register</a>
            </p>
        </form>
      </div>

      </div>
        `;
  },

  init(): void {
    console.log("DEUBG: Login Page loaded!");

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
        return;
      }

      authService.login(response.token);
      const redirectPath = authService.getRedirectAfterLogin();
      router.navigateTo(redirectPath);
    } catch (error) {
      if ((error as any).status == 401) {
        const loginError = document.getElementById("login-error") as HTMLElement;
        loginError.textContent = "Username or password incorrect!";
        loginError.hidden = false;
        console.error("DEBUG Pass ou user wrong");
      } else {
        console.error((error as any)?.message);
        console.error("DEBUG FODEU GERAL");
      }
    }
    return;
  }
} as const;

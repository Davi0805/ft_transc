import {
  togglePasswordVisibility,
  saveToken,
  showError,
} from "../../utils/domUtils.js";
import { TwoFactorAuth } from "./twoFactorAuth.js";
import { login } from "../../api/loginAPI.js";

export const LoginPage = {
  template() {
    return `
      <div id="log-wrapper" class="content loggin-wrapper">
        <form id="login-form">
          <h1 class="title">Login</h1>
          <div class="input-box">
            <input id="username" type="text" placeholder="Username" name="username" required />
            <img src="../Assets/icons/user.svg" />
          </div>
          <div class="input-box">
            <input id="password" type="password" placeholder="Password" name="password" required />
            <img class="visibility" src="../Assets/icons/visibility-on.svg" />
          </div>

          <div class="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" class="button btn">Login</button>

          <div class="register-link">
            <p>Don't have an account? <a href="/register" data-link>Register</a></p>
          </div>
        </form>
      </div>
        `;
  },

  init() {
    console.log("Login Page loaded!");

    togglePasswordVisibility();

    const form = document.getElementById("login-form");
    form.addEventListener("submit", this.handleSubmit);
  },

  async handleSubmit(e) {
    e.preventDefault(); // prevent default browser action

    // Input
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userData = { username, password };

    try {
      const response = await login(userData);

      const token = response.token;

      if (!response.verified) {
        await TwoFactorAuth.show(token); // error checking for this inside
        return;
      }

      console.log("aqui");
      saveToken(token);
      window.router.navigateTo("/");
    } catch (error) {
      if (error.status == 401) {
        // TODO HERE add a function to display the error
        console.error("Pass ou user wrong");
      } else console.error(error.message);
      console.error("FODEU GERAL");
    }
    return;
  },
};

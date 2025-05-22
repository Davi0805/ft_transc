import { togglePasswordVisibility, saveToken, showError } from "../../utils/domUtils.js";
import { twoFactorAuthentication } from "./twoFactorAuth.js"


async function loginUser(userData) {
  const response = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login Error");
  }

  return await response.json();
}



export const LoginPage = {
  template() {
    return `
      <div id="log-wrapper" class="loggin-wrapper">
        <form id="login-form">
          <h1>Login</h1>
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

          <button type="submit" class="btn">Login</button>

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

    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // prevent default browser action

      // Input
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const userData = { username, password };
      try {
        const response = await loginUser(userData);

        console.log('DEBUG: Log in check');

        const token = response.token;

        if (!response.verified) {
          console.log("Needs 2fa");
          await twoFactorAuthentication(token);
        }
        else {
          saveToken(token);
          window.router.navigateTo('/');
        }

      }
      catch (e) {
        console.log("FODEU GERAL");
        console.log(e);
        return;
      }
    });
  },
};

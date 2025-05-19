import { togglePasswordVisibility } from "../utils/domUtils.js";

export const LoginPage = {
  template() {
    return `
      <div class="loggin-wrapper">
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

      const userData = {
        username,
        password
      };

      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const responseData = await response.json();
        const token = responseData.token;

        const response2 = await fetch('http://localhost:8080/twofa/activate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const response2Data = await response2.json();
        const qrcode = response2Data.qrcode;

        let div = document.createElement('img');

        div.src = `${qrcode}`;
        const container = document.getElementById('loggin-wrapper');
        container.appendChild(div);

      }
      catch (e) {
        console.log("FODEU GERAL");
        console.log(e);
        return;
      }


    });



  },
};

import { togglePasswordVisibility, showError } from "../utils/domUtils.js";
import { register } from "../api/registerAPI.js"

export const RegisterPage = {
  template() {
    return `
    <div id="register-wrapper" class="content">
      <form id="register-form">
        <h1 class="title">Register</h1>

        <div class="input-box">
          <input id="name" type="text" placeholder="Name" name="name" required 
          pattern="^(?=.*[A-Za-z])[A-Za-z ]{2,40}$" 
          title="Name must be 2–40 characters long and can include letters and spaces" />
          <img src="../Assets/icons/id-card.svg" />
        </div>

        <div class="input-box">
          <input id="username" type="text" placeholder="Username" name="username" required 
          pattern="^[a-zA-Z0-9_-]{3,15}$" 
          title="Username must be 3-15 characters long and can include letters, numbers, '_' or '-'" />

          <img src="../Assets/icons/user.svg" />
        </div>

        <div class="input-box">
          <input id="email" type="email" placeholder="Email" name="email" required />
          <img src="../Assets/icons/atsign.svg" />
        </div>

        <div class="input-box">
          <!-- (?.*\\d) is asking for a digit  -->
          <!-- (?.*[a-z] and [A-Z]) is asking for a lower letter and a upper letter  -->
          <!-- (?.*[!@#$%^&*.\\-_+=?]) is asking for one of these special chars  -->
          <!-- [A-Za-z\\d!@#$%^&*._\\-+=?] is cehcking for only these characters  -->
          <!-- (.{8,}) is asking for minimum length of 8  -->
          <!-- ^ and $ is the start and end of string -->
          <input id="password" type="password" placeholder="Password" name="password" autocomplete="new-password" required 
          pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*._\\-+=?])[A-Za-z\\d!@#$%^&*._\\-+=?]{8,}$"
          title="Must contain at least one digit, one uppercase and lowercase letter and one special character (!@#$%^&*.\\-_+=?)"/> 
          <img class="visibility" src="../Assets/icons/visibility-on.svg" />
        </div>

        <div class="input-box">
          <input id="confirm-password"type="password" placeholder="Password" name="confirm-password" autocomplete="new-password" required 
          title="Must match the password above"/>
          <img class="visibility" src="../Assets/icons/visibility-on.svg" />
        </div>

        <div id="pass-error" aria-live="polite" hidden></div>

        <button type="submit" class="button">Register</button>
        </div>
      </form>
     </div>
      `;
  },

  renderSuccessHTML() {
    const wrapper = document.getElementById('register-wrapper');
    wrapper.innerHTML =  `
      <div class="registration-success">
        <h1 class="title">Success!</h1>
        <p class="description">Congratulations, your account has been successfully created.</p>
        <div class="options">
          <button id="btn-h" class="button">Home Page</button>
          <button id="btn-p" class="button">Log In</button>
        </div>
      </div>
    `;
    const buttonHome = document.getElementById('btn-h');
    const buttonPlay = document.getElementById('btn-p');
    buttonHome.addEventListener('click', () => window.router.navigateTo('/'));
    buttonPlay.addEventListener('click', () => window.router.navigateTo('/play'));
  },

  init() {
    console.log("Register page loaded!");

    togglePasswordVisibility();

    const form = document.getElementById('register-form');

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // prevent default browser action

      // Input
      const name = document.getElementById('name').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password_hash = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const registerError = document.getElementById('pass-error');

      // check for correct characters, lenght and confirmation match
      if (password_hash != confirmPassword) {
        registerError.textContent = "Passwords do not match!"
        registerError.hidden = false;
        return;
      }

      try {
        await register (name, username, email, password_hash);
        this.renderSuccessHTML();
        return;
      } catch (error) {
        if (error.status == 400) {
          registerError.textContent = "Username or email already taken!"
          registerError.hidden = false;
        }
      }
    });
  }
};

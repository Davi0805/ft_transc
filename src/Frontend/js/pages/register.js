import { togglePasswordVisibility, showError } from "../utils/domUtils.js";
import { register } from "../api/registerAPI.js"
import { translator } from "../services/translationService.js";

export const RegisterPage = {
  template() {
    return `
    <div id="register-wrapper" class="content">
      <form id="register-form">
        <h1 class="title" data-i18n="register-title">Register</h1>

        <div class="input-box">
        <input id="username" type="text" placeholder="Username" name="username" data-i18n-placeholder="register-place-username" required 
        pattern="^[a-zA-Z0-9_\\-]{3,15}$" 
        title="Username must be 3-15 characters long and can include letters, numbers, '_' or '-'" data-i18n-title="register-title-username" />
        
        <img src="../Assets/icons/user.svg" draggable="false" />
        </div>

        <div class="input-box">
          <input id="name" type="text" placeholder="Nickname" name="name" data-i18n-placeholder="register-place-nickname" required 
          pattern="^(?=.*[A-Za-z])[A-Za-z ]{2,40}$" 
          title="Name must be 2–40 characters long and can include letters and spaces" data-i18n-title="register-title-name" />
          <img src="../Assets/icons/id-card.svg" draggable="false" />
        </div>

        <div class="input-box">
          <input id="email" type="email" placeholder="Email" name="email" data-i18n-placeholder="register-place-email" required />
          <img src="../Assets/icons/atsign.svg" draggable="false" />
        </div>

        <div class="input-box">
          <!-- (?.*\\d) is asking for a digit  -->
          <!-- (?.*[a-z] and [A-Z]) is asking for a lower letter and a upper letter  -->
          <!-- (?.*[!@#$%^&*.\\-_+=?]) is asking for one of these special chars  -->
          <!-- [A-Za-z\\d!@#$%^&*._\\-+=?] is cehcking for only these characters  -->
          <!-- (.{8,}) is asking for minimum length of 8  -->
          <!-- ^ and $ is the start and end of string -->
          <input id="password" type="password" placeholder="Password" name="password" autocomplete="new-password" data-i18n-placeholder="register-place-password" required 
          pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*._\\-+=?])[A-Za-z\\d!@#$%^&*._\\-+=?]{8,}$"
          title="Must contain at least one digit, one uppercase and lowercase letter and one special character (!@#$%^&*.\\-_+=?)" data-i18n-title="register-title-pass"/> 
          <img class="visibility" src="../Assets/icons/visibility-on.svg" draggable="false" />
        </div>

        <div class="input-box">
          <input id="confirm-password"type="password" placeholder="Password" name="confirm-password" autocomplete="new-password" data-i18n-placeholder="register-place-password" required 
          title="Must match the password above" data-i18n-title="register-title-confirmpass" />
          <img class="visibility" src="../Assets/icons/visibility-on.svg" draggable="false" />
        </div>

        <div class="error" aria-live="polite" data-i18n="register-pass-error" hidden></div>
        <div class="error" aria-live="polite" data-i18n="register-taken-error" hidden></div>

        <button type="submit" class="button" data-i18n="register-btn">Register</button>
        </div>
      </form>
     </div>
      `;
  },

  renderSuccessHTML() {
    const wrapper = document.getElementById('register-wrapper');
    wrapper.innerHTML =  `
      <div class="registration-success">
        <h1 class="title" data-i18n="register-success-title">Success!</h1>
        <p class="description" data-i18n="register-success-description">Congratulations, your account has been successfully created.</p>
        <div class="options">
          <button id="btn-home" class="button" data-i18n="register-success-btn-home">Home Page</button>
          <button id="btn-login" class="button" data-i18n="register-success-btn-login">Log In</button>
        </div>
      </div>
    `;
    translator.apply();
    const buttonHome = document.getElementById('btn-home');
    const buttonLogin = document.getElementById('btn-login');
    buttonHome.addEventListener('click', () => window.router.navigateTo('/'));
    buttonLogin.addEventListener('click', () => window.router.navigateTo('/login'));
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
      const passError = document.querySelector('.error[data-i18n="register-pass-error"]');
      const takenError = document.querySelector('.error[data-i18n="register-taken-error"]');
      
      passError.hidden = true;
      takenError.hidden = true;

      // check for correct characters, lenght and confirmation match
      if (password_hash != confirmPassword) {
        passError.textContent = translator.get("register-pass-error");
        passError.hidden = false;
        return;
      }

      try {
        await register (name, username, email, password_hash);
        this.renderSuccessHTML();
        return;
      } catch (error) {
        if (error.status == 400) {
          takenError.textContent = translator.get("register-taken-error");
          takenError.hidden = false;
        }
      }
    });
  }
};

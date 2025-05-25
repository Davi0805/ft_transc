import { togglePasswordVisibility, showError } from "../utils/domUtils.js";

export const RegisterPage = {
  template() {
    return `
    <div class="register-wrapper content">
      <form id="register-form">
        <h1 class="title">Register</h1>

        <div class="input-box">
          <input id="name" type="text" placeholder="Name" name="name" required />
          <img src="../Assets/icons/id-card.svg" />
        </div>

        <div class="input-box">
          <input id="username" type="text" placeholder="Username" name="username" required />
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

        <div id="pass-error" aria-live="polite" hidden>Passwords do not match!</div>

        <button type="submit" class="button">Register</button>
        </div>
      </form>
     </div>
      `;
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
      const matchError = document.getElementById('pass-error');

      // check for correct characters, lenght and confirmation match
      if (password_hash != confirmPassword) {
        matchError.hidden = false;
        return;
      }

      const userData = {
        name,
        username,
        email,
        password_hash
      };

      try {
        await fetch('http://localhost:8080/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        window.router.navigateTo('/');
      }
      catch (e) {
        console.log("FODEU GERAL");
        return;
      }

    });

  },
};

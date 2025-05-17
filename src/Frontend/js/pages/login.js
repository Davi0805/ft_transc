export const LoginPage = {
  template() {
    return `
      <div class="loggin-wrapper">
        <form action="">
          <h1>Login</h1>
          <div class="input-box">
            <input type="text" placeholder="Username" name="username" required />
            <img src="../Assets/icons/user.svg" />
          </div>
          <div class="input-box">
            <input type="password" placeholder="Password" name="password" required />
            <img id="visibility" src="../Assets/icons/visibility-on.svg" />
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

    const visibility_icon = document.getElementById('visibility');
    const password = document.querySelector('input[name="password"]');

    /* This changes the onclick method */
    visibility_icon.onclick = () => {
      if (password.type === "password") {
        password.type = "text";
        visibility_icon.src="../Assets/icons/visibility-off.svg";
      }
      else {
        password.type = "password";
        visibility_icon.src="../Assets/icons/visibility-on.svg"
      }
    };
  },
};

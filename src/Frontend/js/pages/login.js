export const LoginPage = {
  template() {
    return `
      <div class="loggin-wrapper">
        <form action="">
          <h1>Login</h1>
          <div class="input-box">
            <input type="text" placeholder="Username" required />
            <img src="../Assets/icons/user-square.png" />
          </div>
          <div class="input-box">
            <input type="password" placeholder="Password" required />
            <img src="../Assets/icons/lock.png" />
          </div>

          <div class="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" class="btn">Login</button>

          <div class="register-link">
            <p>Don't have an account? <a href="#">Register</a></p>
          </div>
        </form>
      </div>
        `;
  },

  init() {
    console.log("Login Page loaded!");
  },
};

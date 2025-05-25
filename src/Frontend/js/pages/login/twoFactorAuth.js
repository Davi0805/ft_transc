import { verifyTwoFactorCode } from "../../api/twoFactorAPI.js";
import { showError } from "../../utils/domUtils.js";

export const TwoFactorAuth = {
  renderHTML() {
    return `
      <div id="twofa-wrapper" class="twofa-wrapper">
        <h1>Two-Factor Authentication</h1>
    
        <form id="twofa-form">
          <div class="input-box">
            <input id="twofa-code" type="text" placeholder="Enter 2FA Code" name="twofa-code" required />
          </div>
          <button type="submit" class="btn">Verify</button>
        </form>
        <p>Return to <a href='#'>site</a></p>
      </div>
    `;
  },

  async show(token) {
    const container = document.getElementById("log-wrapper");
    container.innerHTML = this.renderHTML();

    const twofaForm = document.getElementById("twofa-form");
    twofaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const code = document.getElementById("twofa-code").value;
      try {
        await verifyTwoFactorCode(token, code);
        saveToken(token);
        window.router.navigateTo("/");
      } catch (error) {
        showError("Wrong code try again"); // todo
      }
    });
    return;
  },
};

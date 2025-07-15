import { verifyTwoFactorCode } from "../../api/twoFactorAPI";
import { authService } from "../../services/authService";
import { translator } from "../../services/translationService"
import { router } from "../../routes/router";

export const TwoFactorAuth = {
  renderHTML(): string {
    return `
      <div id="twofa-wrapper" class="twofa-wrapper">
      <div class = content>

        <h1 class="title" data-i18n="2fa-title">Two-Factor Authentication</h1>
        <p class="text text-center" data-i18n="2fa-text">Enter the verification code to continue</p>
        <form id="twofa-form">
          <div id="otp-container">
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" autofocus/>
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
          </div>
          <div id="2facode-error" aria-live="polite" hidden></div>
          <button type="submit" class="button" data-i18n="2fa-btn">Verify</button>
        </form>
      </div>
      </div>
    `;
  },

  async show(token: string): Promise<void> {
    const container = document.getElementById("log-wrapper");
    if (!container) return;
    container.innerHTML = this.renderHTML();
    translator.apply();
    
    const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');

    inputs.forEach((input, idx) => {
      input.addEventListener('input', () => {
        const val = input.value;
        if (val.length === 1 && idx < inputs.length - 1)
            inputs[idx + 1].focus();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && idx > 0)
          inputs[idx - 1].focus();
      })
    });

    const twofaForm = document.getElementById("twofa-form") as HTMLFormElement;
    twofaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const code = Array.from(inputs).map(input => input.value).join('');
      try {
        await verifyTwoFactorCode(token, code);

        authService.login(token);
        
        const redirectPath = authService.getRedirectAfterLogin();
        router.navigateTo(redirectPath);
      } catch (error) {
        if ((error as any).status == 401) {
          const loginError = document.getElementById('2facode-error') as HTMLElement;
          loginError.textContent = "Verification code is incorrect!"
          loginError.hidden = false;
          console.error("DEBUG 2FA code wrong");
        }
      }
    });
    return;
  }
} as const;

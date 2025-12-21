import { verifyTwoFactorCode } from "../../api/login/twoFactorAPI";
import { authService } from "../../services/authService";
import { translator } from "../../services/translationService";
import { router } from "../../routes/router";
import { ErrorPopup } from "../../utils/popUpError";
import { WarningPopup } from "../../utils/popUpWarn";
import DOMPurify from "dompurify";

export const TwoFactorAuth = {
  renderHTML(): string {
    return `
      <div id="twofa-wrapper" class="w-420 content">
        <h1 class="title mb-4" data-i18n="2fa-title">Two-Factor Authentication</h1>
        <p class="text text-center" data-i18n="2fa-text">Enter the verification code to continue</p>
        <form id="twofa-form" class="flex flex-col">
          <div id="otp-container">
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" autofocus/>
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
            <input type="text" placeholder='X' inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-input" />
          </div>
          <div class="flex justify-center">
            <button type="submit" class="button active:bg-[#bdbdbd]" data-i18n="2fa-btn">Verify</button>
          </div>
        </form>
      </div>
    `;
  },

  async show(token: string): Promise<void> {
    const container = document.querySelector("main");
    if (!container) {
      const warnPopup = new WarningPopup();
      warnPopup.create(
        "Something is strange...",
        "Seems like the page was not loaded correctly..."
      );
      return;
    }

    container.innerHTML = DOMPurify.sanitize(this.renderHTML());
    translator.apply();

    const inputs = document.querySelectorAll<HTMLInputElement>(".otp-input");

    inputs.forEach((input, idx) => {
      input.addEventListener("input", () => {
        const val = input.value;
        if (val.length === 1 && idx < inputs.length - 1)
          inputs[idx + 1].focus();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && idx > 0)
          inputs[idx - 1].focus();
      });
    });

    const twofaForm = document.getElementById("twofa-form") as HTMLFormElement;
    twofaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const code = Array.from(inputs)
        .map((input) => input.value)
        .join("");
      try {
        await verifyTwoFactorCode(token, code);

        authService.login(token);

        const redirectPath = authService.getRedirectAfterLogin();
        router.navigateTo(redirectPath);
      } catch (error) {
        if ((error as any).status == 400) {
          const errorPopup = new ErrorPopup();
          errorPopup.create(
            "Invalid Code",
            "The code you entered is incorrect. Please try again."
          );
          console.error("DEBUG 2FA code wrong");
        } else {
          console.error(
            "DEBUG: Something went wrong:",
            (error as any)?.message);
          const errPopup = new ErrorPopup();
          errPopup.create(
            "Error Logging In",
            "Something went wrong while trying to log in. Refresh and try again."
          );
        }
      }
    });
    return;
  },
} as const;

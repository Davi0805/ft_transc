import { PopupBase } from "./popUpBase"

/* USAGE
const popup = new SuccessPopup();
popup.create(title, description, autoClose?)
*/

export class SuccessPopup extends PopupBase {
    create(title: string, description: string, autoClose: boolean = true): void {
        const popup = document.createElement('div');
        popup.classList = `popup bg-popup-success-bg border-popup-success-border`;

        popup.innerHTML = `
                        <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-base text-white bg-[#28a745]">✓</div>
                        <div class="flex-1">
                            <div class="text-base font-semibold mb-1 text-[#155724]">${title}</div>
                            <div class="text-sm text-[#155724] leading-snug">${description}</div>
                            <button  class="popup-close absolute top-2 right-2 bg-none border-none text-lg cursor-pointer text-[#999] h-6 w-6 flex items-center justify-center rounded-full 
                            transition-colors duration-200 ease-in-out hover:bg-black/10">×</button>
                            ${autoClose ? '<div class="absolute bottom-0 left-0 h-0.5 bg-black/20 rounded-b-md animate-progressBar"></div>' : ''}
                        </div>
                        `;
        
        const closeBtn = popup.querySelector(".popup-close") as HTMLButtonElement;
        closeBtn.addEventListener('click', () => this.removePopup(popup));

        this.addPopup(popup);

        // Entrada
        setTimeout(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translateX(0)';
        }, 100);

        if (autoClose) {
            setTimeout(() => {
                this.removePopup(popup);
            }, 5000);
        }
    }
}
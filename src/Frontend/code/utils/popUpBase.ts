import { authService } from "../services/authService";

export class PopupBase {
  private container: HTMLElement;

  constructor(containerId: string = "popupContainer") {
    this.container =
      document.getElementById(containerId) || this.createContainer();
  }
  private createContainer(): HTMLElement {
    const container = document.createElement("div");
    container.id = "popupContainer";
    container.classList.add(
      authService.isAuthenticated ? "right-52" : "right-5"
    );
    document.querySelector("main")?.appendChild(container);
    return container;
  }

  protected addPopup(element: HTMLElement): void {
    this.container.appendChild(element);
  }

  protected removePopup(element: HTMLElement): void {
    element.style.transform = "translateX(100%)";
    element.style.opacity = "0";

    setTimeout(() => {
      element.remove();
    }, 300);
  }
}

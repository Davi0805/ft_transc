export class InitialLoader {
    private static instance: InitialLoader | null = null;
    private loaderElement: HTMLElement | null = null;
 
    constructor() {
      document.body.classList.toggle("overflow-hidden"); // Prevent scrolling during loading


      this.loaderElement = document.createElement("div");
      this.loaderElement.id = "initial-loader";
      this.loaderElement.className = "fixed inset-0 h-full w-full flex flex-col items-center justify-center bg-gray-800 z-50 transition-opacity duration-500 opacity-100";
      this.loaderElement.innerHTML = `
                                    <!-- Loader -->
      <!-- Logo -->
      <img src="./Assets/42PortoLogo.png" alt="42Porto logo" class="mb-12 w-[300px] h-[150]" draggable="false"> 
      <!-- Loader -->
      <div class="flex flex-row gap-2">
        <div class="w-6 h-6 rounded-full bg-blue-300 animate-bounce"></div>
        <div class="w-6 h-6 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
        <div class="w-6 h-6 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
      </div>
      `;

      this.loaderElement.addEventListener("transitionend", () => {
          this.loaderElement?.remove();
          document.body.classList.toggle("overflow-hidden"); // maybe move this into removeLoader
          
      }, { once: true }); // handler only runs once
      
      document.body.insertAdjacentElement('afterbegin', this.loaderElement);
    }

    // Singleton to ensure only one instance exists
    public static getInstance(): InitialLoader {
        if (!InitialLoader.instance) {
            InitialLoader.instance = new InitialLoader();
        }
        return InitialLoader.instance;
    }

    // Method to remove the loader
    public removeLoader(): void {
        if (this.loaderElement) {
            setTimeout(() => {
                if (this.loaderElement) {
                    this.loaderElement.classList.replace("opacity-100", "opacity-0");
                }
            }, 1069);       
        }
    }  
}
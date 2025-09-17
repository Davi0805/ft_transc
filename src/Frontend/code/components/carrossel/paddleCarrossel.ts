export class PaddleCarrossel {
    private paddles: { id: number; asset: string }[];
    private currentIndex: number = 0;
    private prevBtn: HTMLButtonElement;
    private nextBtn: HTMLButtonElement;
    private displayImg: HTMLImageElement;
    private selectInput: HTMLSelectElement;

    constructor(prevBtnID: string,
                nextBtnID: string, 
                displayImgID: string,
                selectInputID: string) {
        this.paddles = [
            { id: 0, asset: 'Assets/sprites/paddle0.png' },
            { id: 1, asset: 'Assets/sprites/paddle1.png' },
            { id: 2, asset: 'Assets/sprites/paddle2.png' },
            { id: 3, asset: 'Assets/sprites/paddle3.png' },
            { id: 4, asset: 'Assets/sprites/paddle4.png' },
            { id: 5, asset: 'Assets/sprites/paddle5.png' },
            { id: 6, asset: 'Assets/sprites/paddle6.png' },
            { id: 7, asset: 'Assets/sprites/paddle7.png' }
        ];

        this.prevBtn = document.getElementById(prevBtnID) as HTMLButtonElement;
        this.nextBtn = document.getElementById(nextBtnID) as HTMLButtonElement;
        this.displayImg = document.getElementById(displayImgID) as HTMLImageElement;
        this.selectInput = document.getElementById(selectInputID) as HTMLSelectElement;

        this.init();    
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.showPrevious());
        this.nextBtn.addEventListener('click', () => this.showNext());
        
        this.updateDisplay();
        this.updateButtons();
    }

    static getPaddleCarrosselHTML(): string {
        return `
                <div class="w-full">
                    <div class="flex items-center gap-4">
                        <div class="flex-1 flex items-center justify-center h-14 gap-3 p-4 bg-transparent border border-white/30 rounded-lg shadow-lg">
                            <button type="button" class="w-9 h-9 bg-blue-500/20 border border-blue-500/30 rounded-lg text-white flex items-center justify-center cursor-pointer transition-all duration-200 text-lg hover:bg-blue-500/30 hover:border-blue-500/50 active:bg-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed" id="paddle-prev">‹</button>
                            <div class="w-44 h-9 flex items-center justify-center relative">
                            <img src="Assets/sprites/paddle0.png"
                                class="rotate-90 origin-center w-9 h-44 rounded border-2 border-white/30 shadow-lg"
                                id="paddle-image">
                            </div>

                            <button type="button" class="w-9 h-9 bg-blue-500/20 border border-blue-500/30 rounded-lg text-white flex items-center justify-center cursor-pointer transition-all duration-200 text-lg hover:bg-blue-500/30 hover:border-blue-500/50 active:bg-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed" id="paddle-next">›</button>
                        </div>
                    </div>
                    <select id="player-paddle" name="player-paddle" class="hidden">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                </div>
        `;
    }

    showPrevious() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateDisplay();
            this.updateButtons();
        }
    }

    showNext() {
        if (this.currentIndex < this.paddles.length - 1) {
            this.currentIndex++;
            this.updateDisplay();
            this.updateButtons();
        }
    }

    updateDisplay() {
        const currentPaddle = this.paddles[this.currentIndex];
        this.displayImg.src = currentPaddle.asset;

        this.selectInput.value = currentPaddle.id.toString();
    }

    updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.paddles.length - 1;
    }
}

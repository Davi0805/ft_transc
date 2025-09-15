type TButton = "button" | "submit" | "reset"

export function setupKeyCaptureButton(button: HTMLButtonElement, inputElement: HTMLInputElement) {
  let isListeningForKey = false;

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!isListeningForKey) return;

    const pressedKey = event.key;
    button.textContent = pressedKey;
    inputElement.value = pressedKey;
    isListeningForKey = false;

    // Remove the key listener after capturing
    window.removeEventListener("keydown", handleKeyPress);
  };

  button.addEventListener("click", () => {
    if (isListeningForKey) return; // prevent double click

    button.textContent = "Press a key";
    isListeningForKey = true;

    // Start listening for key press
    window.addEventListener("keydown", handleKeyPress);
  });
}

//This helper simply creates a button with the specified options
export function getButton(id: string, type: TButton, text: string, big = true) {
    const out = document.createElement("button");
    out.id = id;
    out.type = type;
    out.className = `bg-gray-900/50 bg-opacity-60 ${big ? "p-5" : "p-2"} rounded-4xl hover:bg-gray-900/90 active:bg-gray-900/25`;
    out.textContent = text;

    return out
}

export function getTable(id: string, headHtml: string, bodyHtml: string) {
    const out = document.createElement("div");
    out.id = id;
    out.className = "block max-w-full max-h-full rounded-2xl overflow-y-auto"
    
    const table = document.createElement("table");
    table.className = "w-full";

    const thead = document.createElement("thead");
    thead.id = id + "-head";
    thead.className = "sticky top-0 z-1 bg-gray-900/75"
    thead.innerHTML = headHtml;
    table.appendChild(thead);

    const tbody = document.createElement("tbody")
    tbody.id = id + "-body";
    tbody.innerHTML = bodyHtml
    table.appendChild(tbody);

    out.appendChild(table)
    
    return out
}

export function toggleButton(button: HTMLButtonElement, onText: string, offText: string): boolean {
    //First toggle the button by changing its "active" state
    const isActive = button.classList.toggle('active');
    //Then change the visual aspects of the button
    button.textContent = isActive ? onText : offText;
    button.classList.toggle('bg-gray-900/50', !isActive);
    button.classList.toggle('bg-gray-900/25', isActive);
    return isActive;
}

export function flashButton(button: HTMLButtonElement, tempText: string) {
    const originalText = button.textContent;
    button.textContent = tempText
    setTimeout(() => {
        button.textContent = originalText
    }, 1000)
}
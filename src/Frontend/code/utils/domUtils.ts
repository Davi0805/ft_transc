export function togglePasswordVisibility(): void {
    // getElementsByClassName returns a HTMLCollection not an array
    const visibilityIcons = document.getElementsByClassName('visibility');

    // Array.from() converts the HTMLCollection to an array
    Array.from(visibilityIcons).forEach(visibilityIcon => {
        const icon = visibilityIcon as HTMLImageElement;

        const inputBox = icon.closest('.input-box') as HTMLElement; // closest up in hierarchy that matches
        const passwordInput = inputBox.querySelector('input') as HTMLInputElement;  // from inputBox 

        icon.onclick = () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.src = "../Assets/icons/visibility-off.svg";
            } else {
                passwordInput.type = "password";
                icon.src = "../Assets/icons/visibility-on.svg";
            }
        };
    });
}
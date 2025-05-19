export function togglePasswordVisibility() {
    // getElementsByClassName returns a HTMLCollection not an array
    const visibility_icons = document.getElementsByClassName('visibility');

    // Array.from() converts the HTMLCollection to an array
    Array.from(visibility_icons).forEach(visibility_icon => {
        const inputBox = visibility_icon.closest('.input-box'); // closest up in hierarchy that matches
        const passwordInput = inputBox.querySelector('input');  // from inputBox 

        visibility_icon.onclick = () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                visibility_icon.src = "../Assets/icons/visibility-off.svg";
            } else {
                passwordInput.type = "password";
                visibility_icon.src = "../Assets/icons/visibility-on.svg";
            }
        };
    });
}
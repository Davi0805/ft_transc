export const LoginPage = {
    template() {
        return `
            <div class="login">
                <input type="text" placeholder="username" name="username" id="user">
                <input type="password" name="password" placeholder="password" id="pass">
                <button class="btn">Log In</button>
            </div>
        `;
    }, 

    init () {
        console.log("Login Page loaded!");
    }
};
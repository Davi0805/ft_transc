export const LoginPage = {
    template() {
        return `
            <div class="login">
                <form action=/login method="POST">
                    <input type="text" placeholder="username" name="username" id="user" required>
                    <input type="password" name="password" placeholder="password" id="pass" required>
                    <button type="submit">Log In</button>
                </form>
            </div>
        `;
    }, 

    init () {
        console.log("Login Page loaded!");
    }
};
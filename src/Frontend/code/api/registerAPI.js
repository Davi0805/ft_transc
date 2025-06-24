export async function register(name, username, email, password_hash)
{
    try {
        const response = await fetch("http://localhost:8080/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, username, email, password_hash }),
        });
        
        if (!response.ok) {
            const errorMessage = `DEBUG: Register failed with status ${response.status}`; 
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error; 
        }

    } catch (error) {
        throw error;
    }
    return;
}

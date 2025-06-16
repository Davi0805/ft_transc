export async function getUserDataById(user_id) {
    try {
        const response = await fetch(`http://localhost:8080/users/${user_id}`, {
            method: 'GET',
        });
        
        if (!response.ok) {
            const errorMessage = `DEBUG: getUserByID failed with status ${response.status}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }
        return await response.json();
        
    } catch (error) {
        throw error;
    }
};
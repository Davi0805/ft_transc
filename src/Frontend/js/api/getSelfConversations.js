export async function getSelfConversations(authToken) {
    try {
        const response = await fetch('http://localhost:8081/conversations', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authService.authToken}`,
            }   
        });
        
        if (!response.ok) {
            const errorMessage = `DEBUG: getSelfConversations failed with status ${response.status}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }
        return await response.json();
        
    } catch (error) {
        throw error;
    }
}
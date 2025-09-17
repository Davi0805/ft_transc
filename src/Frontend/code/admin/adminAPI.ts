import { authService } from "../services/authService";


export async function resetRepos(): Promise<void> {
    try {
        if (!authService.isUserAuthenticated()) {
            const errorMessage: string = `DEBUG: No authToken at getLobbySettingsByID`;
            const error: Error = new Error(errorMessage);
            throw error;
        }
        const response = await fetch(`http://localhost:8084/removeRepos`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authService.getToken()}`
            }
        });

        if (!response.ok) {
            const errorMessage: string = `DEBUG: resetRepos failed with status ${response.status}`;
            const error: Error = new Error(errorMessage);
            (error as any).status = response.status;
            throw error;
        }
        return
    
    } catch (error) {
        throw error;
    }
}
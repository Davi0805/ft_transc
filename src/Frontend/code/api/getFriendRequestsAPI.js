import { authService } from "../services/authService.js";

export async function getFriendRequests() {
    try {
        const response = await fetch(`http://localhost:8080/friend_requests/pending`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authService.authToken}`
            }
        });

        if (!response.ok) throw new Error("ERROR: getFriendRequests API CALL"); // TODO

        return await response.json();



    } catch (error) {
        // TODO
    }

        
}
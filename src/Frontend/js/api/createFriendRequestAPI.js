import { authService } from "../services/authService.js";

export async function createFriendRequestByUsername(username){
    try {
        const response = await fetch(`localhost:8080/friend_requests/add/${username}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authService.authToken}`
            }
        });

        if (!response.ok) throw new Error("ERROR: createFriendRequestByID API CALL"); // TODO

        return;
    } catch (error) {
        // TODO
    }
}
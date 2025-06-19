import { authService } from "../services/authService.js";

export async function getMessagesByConvID(convID) {
    try {
        const response = await fetch(`http://localhost:8081/messages/${convID}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authService.authToken}`
            }
        });

        if (!response.ok) throw new Error("ERROR: GET MESSAGES API CALL"); // TODO

        return await response.json();



    } catch (error) {
        // TODO
    }

        
}
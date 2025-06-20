export async function acceptFriendRequest(reqID){
    try {
        const response = await fetch(`http://localhost:8080/friend_requests/${reqID}/accept`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authService.authToken}`
            }
        });

        if (!response.ok) throw new Error("ERROR: acceptFriendRequest API CALL"); // TODO

        return;
    } catch (error) {
        // TODO
    }
}
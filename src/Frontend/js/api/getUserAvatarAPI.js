export async function getUserAvatarById(userId) {
    try {
        const response = await fetch(`http://localhost:8080/users/avatar/${userId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorMessage = `DEBUG: Error on getUserAvatarById with status ${response.status}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        let imgURL;
        if (response.status == 204) // default profile picture
            imgURL = "./Assets/default/bobzao.jpg"
        else {
            const blob = await response.blob();
            imgURL = URL.createObjectURL(blob);
        }
        return imgURL;
    } catch (error) {
        throw error;
    }
}
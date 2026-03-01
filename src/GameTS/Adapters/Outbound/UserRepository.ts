export type UserT = {
    id: number,
    username: string,
    spriteID: number,
    rating: number
}

const testUserRatings = [1500, 1600, 1700, 1800]

class UserRepository {
    
   async getUserByID(userID: number): Promise<UserT> {
        try {
            const reqResponse = await fetch(`http://user-backend:8080/users/${userID}`, {
                method: 'GET',
                headers: {'Authorization': 'Bearer sua-chave-secreta'}
            });
            if (!reqResponse.ok) {console.error(reqResponse.text());}
            const responseJson = await reqResponse.json();
            return {
                id: responseJson.user_id, username: responseJson.username,
                spriteID: responseJson.spriteID, rating: responseJson.rating
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
   }

   async updateUserRating(userID: number, newRating: number) {
        try {
            const reqResponse = await fetch(`http://user-backend:8080/user/ratings/${userID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer sua-chave-secreta',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating: newRating })
            });
            if (!reqResponse.ok) {
                const errorText = await reqResponse.text();
                console.error(errorText);
                throw new Error(`Failed to update user rating: ${errorText}`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
   }

    private _users: UserT[] = []

    private _counter = 0
}

const userRepository = new UserRepository()
export default userRepository;
type TUser = {
    id: number,
    username: string,
    spriteID: number,
    rating: number
}

class UserRepository {
    getUserByID(userID: number) {
        let userInfo = this._users.find(user => user.id === userID)
        if (!userInfo) {
            //This substitutes the register system. Should not be done in production
            userInfo = {
                id: userID,
                username: `User${userID}`,
                spriteID: 0,
                rating: 1500
            }
            this._users.push(userInfo)
        }
        return userInfo
    }

    private _users: TUser[] = []
}

export const userRepository = new UserRepository()
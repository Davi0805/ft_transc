export type UserT = {
    id: number,
    username: string,
    spriteID: number,
    rating: number
}

const testUserRatings = [1500, 1600, 1700, 1800]

class UserRepository {
    getUserByID(userID: number) {
        let userInfo = this._users.find(user => user.id === userID)
        if (!userInfo) {
            //This substitutes the register system. Should not be done in production
            userInfo = {
                id: userID,
                username: `User${userID}`,
                spriteID: 0,
                rating: testUserRatings[this._counter++]
            }
            this._users.push(userInfo)
        }
        return userInfo
    }

    private _users: UserT[] = []

    private _counter = 0
}

export const userRepository = new UserRepository()
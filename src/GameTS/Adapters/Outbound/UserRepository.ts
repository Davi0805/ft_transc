export type UserT = {
    id: number,
    username: string,
    spriteID: number,
    rating: number
}

const testUserRatings = [1500, 1600, 1700, 1800]

class UserRepository {
    getUserByID(userID: number): UserT {

        //TODO: this is a mock data function. Must change this to access the user-friends micro-service
        let userInfo = this._users.find(user => user.id === userID)
        if (!userInfo) {
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

const userRepository = new UserRepository()
export default userRepository;
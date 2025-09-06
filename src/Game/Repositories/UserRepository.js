const testUserRatings = [1500, 1600, 1700, 1800];
class UserRepository {
    getUserByID(userID) {
        let userInfo = this._users.find(user => user.id === userID);
        if (!userInfo) {
            //This substitutes the register system. Should not be done in production
            userInfo = {
                id: userID,
                username: `User${userID}`,
                spriteID: 0,
                rating: testUserRatings[this._counter++]
            };
            this._users.push(userInfo);
        }
        return userInfo;
    }
    _users = [];
    _counter = 0;
}
export const userRepository = new UserRepository();

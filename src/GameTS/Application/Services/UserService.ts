import userRepository from "../../Adapters/Outbound/UserRepository.js";

class UserService {
/*     getUserByID(userID: number) {
        return userRepository.getUserByID(userID);
    } */

/*     getUsernameByID(userID: number) {
        const user = userRepository.getUserByID(userID);
        return user.username;
    } */

    getUserRatingByID(userID: number) {
        const user = userRepository.getUserByID(userID);
        return userRepository.getUserByID(userID).then(user => user.rating);
    }

    updateUserRating(userID: number, newRating: number) {
        userRepository.updateUserRating(userID, newRating);
    }
}

const userService = new UserService();
export default userService;
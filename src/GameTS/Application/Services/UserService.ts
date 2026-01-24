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
        const user = userRepository.getUserByID(userID);
        user.rating = newRating; //TODO a new method in userRepo is needed, because this new value needs to be saved in the database!
    }
}

const userService = new UserService();
export default userService;
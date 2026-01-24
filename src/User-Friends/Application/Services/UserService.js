const userRepository = require('../../Adapters/outbound/Repositories/UserRepository');
const exception = require('../../Infrastructure/config/CustomException');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// dont forget the infinite await/s in the returns and controller 
// to work sync (blocking)

class UserService {


    /* 
    *    @brief Method to get all users (more for debug)
    *    @throws 404 - Not found
    *    @returns list of users
    */
    async getAll()
    {
        const users = await userRepository.findAll();
        if (!users || users.length === 0) throw exception('Users not Found!', 404);
        return users;
    }


    /* 
    *    @brief Method to get user by id
    *    @params id (integer) - user_id 
    *    @throws 404 - Not found
    */
    async findById(id)
    {
        const users = await userRepository.findById(id);
        if (!users || users.length === 0) throw exception('Data not found!', 404);
        return users;
    }

    async findByIdIn(ids)
    {
        const users = await userRepository.findbyIdIn(ids);
        if (!users || users.length == 0)  { throw exception('Data not found!', 404); }
        return users;
    }


    /* 
    *    @brief Method to get user by username
    *    @params username (string) - username 
    *    @throws 404 - Not found
    *    @returns {user_id, username, rating} - user_id and username
    */
    async findByUsername(username)
    {
        try {
            const users = await userRepository.findByUsername(username);
            if (!users || users.length === 0) throw exception('Data not found!', 204);
            return {user_id: users[0].user_id,
                    username: users[0].username,
                    nickname: users[0].name,
                    rating: users[0].rating,
                };    
        } catch (error) {
            throw exception('Failed to fetch user data!', 400);
        }
        
    }

    async getProfileData(username, originUserId)
    {
        try {
            const profileData = await userRepository.getProfileDataByUsername(username, originUserId);
            if (!profileData || profileData.length === 0) throw exception('User not found!', 204);
            profileData[0].is_friend = (profileData[0].is_friend) ? true : false;
            return profileData[0];    
        } catch (error) {
            console.log(error.message);
            throw exception('Failed to find user!', 400);
        }
    }

    /* 
    *    @brief Method to get all users (more for debug)
    *    name, username, email, password
    *    @throws 400 - Bad request
    */
    async createUser(User)
    {
        try {
            const salt = await bcrypt.genSalt(10);
            User.password_hash = await bcrypt.hash(User.password_hash, salt);
            await userRepository.save(User);
        } catch (error) {
            console.error(error);
            throw exception('Failed to create user!', 400);
        }
    }


    /* 
    *    @brief Method that check users credentials on database
    *    @params user (object) - user credentials {username, password}
    *    @throws 401 - Unauthorized
    *    @returns {user_id, twofa_secret}
    */
    async Login(User)
    {
        try {
            const result = await userRepository.findByUsername(User.username);

            const isPasswordValid = await bcrypt.compare(User.password, result[0].password_hash);
            if (!isPasswordValid) {
                throw exception('Login failed! Invalid password.', 401);
            }

            return result[0];
        } catch (error) {
            console.error(error);
            throw exception('Login failed!', 401);
        }
    }


    /* 
    *    @brief Method that saves the 2FA properties on database
    *    @params user_id (integer)
    *    @params twofa_secret (String) 
    *    @throws 400 - Bad request
    */
    async activateTwoFactorAuth(user_id, twofa_secret)
    {
        try {
            await userRepository.addTwoFactorAuth(user_id, twofa_secret);
        } catch (error) {
            throw exception('Failed to activate 2FA', 400)
        }
    }


    async deactivateTwoFactorAuth(user_id)
    {
        try {
            const user = await userRepository.findById(user_id);
            if (user[0].twofa_enabled == false) throw exception('2FA is already disabled', 200);
            await userRepository.removeTwoFactorAuth(user_id);
        } catch (error) {
            throw error;
        }
    }


    /* 
    *    @brief Method that updates the user avatar image_path with new file path
    *    @params user_id (integer)
    *    @params path (string) - file path
    *    @throws 400 - Bad request
    */
    async uploadAvatar(path, user_id)
    {
        try {
            await userRepository.updateUserImagePath(path, user_id);
        } catch (error) {
            throw exception('Failed to upload avatar', 400);
        }
    }


    /* 
    *    @brief Method that updates the users name
    *    @params user (object) - {name, id}
    *    @throws 400 - Bad request
    */
    async updateName(user)
    {
        try {
            await userRepository.updateName(user);
        } catch (error) {
            throw exception('Failed to update name', 400);
        }
    }

    async updateEmail(user)
    {
        try {
            await userRepository.updateEmail(user);
        } catch (error) {
            throw exception('Failed to update name', 400);
        }
    }


    /* 
    *    @brief Method that updates the users password
    *    @params user (object) - {new_password, old_password, id}
    *    @throws 400 - Bad request
    */
    async updatePassword(user)
    {
        // todo: implement proper error handling
        try {
            await userRepository.updatePassword(user);
        } catch (error) {
            throw exception('Failed to update password!', 400);
        }
    }

    async findRatingById(user_id)
    {
        try {
            const userRating = await userRepository.findRatingById(user_id);
            if (!userRating[0].rating) {throw exception('User id not found!');}
            return userRating[0];
        } catch (error) {
            console.log(error);
            throw exception('Failed to find the user rating!', 400);            
        }
    }

    async updateUserRating(user_id, newRating)
    {
        try {
            await userRepository.updateUserRating(user_id, newRating);
        } catch (error) {
            console.error(error);
            throw exception('Failed to update the user rating', 400);
        }
    }

};

module.exports = new UserService();
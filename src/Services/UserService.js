const userRepository = require('../Repositories/UserRepository');

//const bcrypt = require('bcryptjs'); // hashing lib to the passwords
//import bcrypt from "bcryptjs";
// dont forget the infinite await/s in the returns and controller 
// to work sync (blocking)

class UserService {

    async getAll() {
        return await userRepository.findAll();
    }

    async findById(id)
    {
        return await userRepository.findById(id);
    }

    async createUser(User) {
        /* User.password_hash = this.fastify.bcrypt.hashSync(User.password_hash, 10, function(err, hash) {
            if (err)
                console.log(err.message);
            else
                console.log(hash);
        }); */
        
        try {
            const result = await userRepository.save(User);
            return true;
        } catch (error) {
            return false;
        }
    }

    async Login(User)
    {
        try {
            const result = await userRepository.findByUsername(User.username);
            /* await this.fastify.bcrypt.compare(User.password, result[0].password_hash); */
            if (User.password == result[0].password_hash)
                return result[0].user_id;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};

module.exports = new UserService();
const userRepository = require('../Repositories/UserRepository');
//const bcrypt = require('bcryptjs'); // hashing lib to the passwords
//import bcrypt from "bcryptjs";
// dont forget the infinite await/s in the returns and controller 
// to work sync (blocking)

class UserService {

    async getAll() {
        console.log("ALOOOOOOOOOOOOOOOOOOOOOOoo");
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
        const result = await userRepository.findByUsername(User.username);
        try {
            /* await this.fastify.bcrypt.compare(User.password, result[0].password_hash); */
            console.log(result[0].password_hash + " = " + User.password);
            if (User.password == result[0].password_hash)
                return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};

module.exports = new UserService();
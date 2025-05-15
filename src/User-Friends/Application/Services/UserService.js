const userRepository = require('../../Adapters/outbound/Repositories/UserRepository');

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
                return {user_id: result[0].user_id, twofa_secret: result[0].twofa_secret};
            else
                return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async activateTwoFactorAuth(user_id, twofa_secret)
    {
        try {
            const result = await userRepository.addTwoFactorAuth(user_id, twofa_secret);
            console.log('TWO FA REPO ANSWER = ' + result);
        } catch (error) {
            console.log('ERRO: Activate Two Factor Auth - ' + error);
        }
    }

};

module.exports = new UserService();
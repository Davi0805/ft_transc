const userRepository = require('../Repositories/UserRepository');
const bcrypt = require('bcrypt'); // hashing lib to the passwords

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
        User.password_hash = await bcrypt.hash(User.password_hash, 10);
        
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
            await bcrypt.compare(User.password, result[0].password_hash);
            return true;           
        } catch (error) {
            return false;
        }
    }
};

module.exports = new UserService();
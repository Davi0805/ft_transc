const userRepository = require('../Repositories/UserRepository');

// dont forget the infinite await/s in the returns and controller 
// to work sync (blocking)

class UserService {

    async getAll() {
        return await userRepository.findAll();
    }
};

module.exports = new UserService();
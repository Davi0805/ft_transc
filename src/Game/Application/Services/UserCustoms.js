const usrCustomsRepo = require('../../Adapters/outbound/UserCustomsRepository');

class UserCustomsService {
    async getUserById(user_id)
    {
        return await usrCustomsRepo.getByUserId(user_id);
    }

    async createDefault(user_id)
    {
        return await usrCustomsRepo.createDefault(user_id);
    }

    async updateUserCustoms(paddle_sprite, user_id)
    {
        return await usrCustomsRepo.update(paddle_sprite, user_id);
    }
}

module.exports = new UserCustomsService();
const blockRepo = require('../../Adapters/outbound/Repositories/blockRelationsRepository');
const exception = require('../../Infrastructure/config/CustomException');

class BlockService{

    async getMyBlockList(userId)
    {
        try {
            return await blockRepo.getAllBlocks(userId);
        } catch (error) {
            console.error(error.message);
            throw exception('Failed to get block list', 400);
        }
    }

    async blockUser(userId, targetId)
    {
        try {
            return await blockRepo.newBlock(userId, targetId);
        } catch (error) {
            console.error(error.message);
            throw exception('Failed to block user', 400);
        }
    }

    async unblockUser(userId, targetId)
    {
        try {
            return await blockRepo.unblock(userId, targetId);
        } catch (error) {
            console.error(error.message);
            throw exception('Failed to unblock user', 400);
        }
    }

    async isUserBlocked(userId, targetId)
    {
            const block = await blockRepo.isUserBlocked(userId, targetId);
            if (block.length != 0) { return ({is_blocked: true}); };
            return ({is_blocked: false})
    }
};

module.exports = new BlockService();
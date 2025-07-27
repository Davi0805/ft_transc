const mapRepo = require('../../Adapters/outbound/MapRepository');

class MapService {
    async getAll()
    {
        return await mapRepo.getAll();
    }
};

module.exports = new MapService();
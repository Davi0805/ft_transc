const redisService = require('../../Application/Services/RedisService');
const exception = require('./CustomException');


/* 
*   Middleware to remove boilerplate authentication in the controller
*   And when authenticated set the session metadata to req object
*   Example: To access user_id in controller -> req.session.user_id
*/
async function authMiddleware(req, reply)
{
        const authHeader = req.headers.authorization;
        if (!authHeader) throw exception('Authorization header not found!', 401);
        const metadata = await redisService.validateSession(authHeader);
        req.session = metadata;
}

module.exports = authMiddleware
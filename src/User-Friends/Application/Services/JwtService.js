const jwt = require('jsonwebtoken');
const { getSecret } = require('./vault-client');

class JwtService {
    constructor(secretToken) {
        this.secretToken = secretToken;
    }

    generate(userId) {
        const payload = { user_id: userId };
        const options = { expiresIn: '1h' };
        return jwt.sign(payload, this.secretToken, options);
    }

    validate(token) {
        try {
            const decoded = jwt.verify(token, this.secretToken);
            return !!decoded;
        } catch {
            return false;
        }
    }
}

let jwtServiceInstance = null;

const initPromise = (async () => {
    const secret = await getSecret('jwt');
    if (!secret || !secret.jwt_secret) {
        throw new Error('Failed to initialize JwtService: Secret not found or invalid.');
    }
    jwtServiceInstance = new JwtService(secret.jwt_secret);
})();

module.exports = new Proxy({}, {
    get(target, prop) {
        if (!jwtServiceInstance) {
            throw new Error('JwtService is not initialized yet. Ensure initialization is complete before using.');
        }
        return jwtServiceInstance[prop];
    },
    async init() {
        await initPromise;
    }
});
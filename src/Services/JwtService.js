const jwt = require('jsonwebtoken');


class JwtService {
    constructor()
    {
        this.secretToken = 'meu-token-mt-secreto';
    }


    async generate(userId)
    {
        const payload = { user_id: userId };
        const options = { expiresIn: '1h'};
        const token = await jwt.sign(payload, this.secretToken, options);
        console.log(token);
        return token;
    }

    async validate(token)
    {
        const decoded = jwt.verify(token, this.secretToken);
        if (!decoded)
            return false;
        return true;
    }
}

module.exports = new JwtService();
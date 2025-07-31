const fp = require('fastify-plugin');
const multer = require('fastify-multer');
const path = require('path');
const fs = require('fs');
const redisService = require('../../Application/Services/RedisService');

const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const fileName = 'avatar_' + req.session.user_id + path.extname(file.originalname);
        if (fs.existsSync(fileName))
            fs.unlink(fileName)
        cb(null, fileName);
    }
});

// todo: maybe add a filter to only allow images
const upload = multer({ storage: storage });

function multerConfig(fastify, opts, done) {

    fastify.addContentTypeParser('multipart/form-data', (request, payload, done) => {
        done(null);
    });

    fastify.decorate('blob', upload);
    done();
}

module.exports = fp(multerConfig);
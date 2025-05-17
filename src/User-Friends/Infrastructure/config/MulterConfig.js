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
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// todo: maybe add a filter to only allow images
const upload = multer({ storage: storage });

function multerConfig(fastify, opts, done) {

    fastify.addContentTypeParser('multipart/form-data', (request, payload, done) => {
        done(null);
    });

    // Decorate fastify with the blob object containing upload methods
    fastify.decorate('blob', upload);
    done();
}

// Export wrapped with fastify-plugin to preserve decorations
module.exports = fp(multerConfig);
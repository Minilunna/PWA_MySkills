module.exports = {
    mongodb: {
        uri: 'mongodb+srv://1303334:INXxlwEGgH9xI1AK@cluster0.vdqtage.mongodb.net/my-skills?retryWrites=true&w=majority', //'mongodb://admin:admin@localhost:27017/my-skills?authSource=admin',
        collections: {
            user: 'users',
            role: 'roles',
            skill: 'skills'
        },
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    security: {
        secret: "jwt-secret-key",
        options: {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        }
    },
};

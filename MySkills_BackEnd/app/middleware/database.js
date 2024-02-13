
module.exports = (app) => {
    const { mongoose, roles, role: Role } = require('../models');
    const { mongodb } = require('../config');

    mongoose.connect(mongodb.uri, mongodb.options).then(() => {
        console.log("Successfully connect to MongoDB.");
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                console.log('---Initialize datamodel');
                roles.forEach(
                    (name) => new Role({ name: name }).save(err => {
                        if (err) {
                            console.log("error", err);
                        }
                        console.log("added '" + name + "' to roles collection");
                    })
                );
            }
        });
    }).catch(err => {
        console.error("Connection error", err);
        process.exit();
    });
}
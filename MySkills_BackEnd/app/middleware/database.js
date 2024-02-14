module.exports = (app) => {
    // Importa os modelos e configurações necessárias
    const { mongoose, roles, role: Role } = require('../models');
    const { mongodb } = require('../config');

    // Liga-se ao MongoDB 
    mongoose.connect(mongodb.uri, mongodb.options).then(() => {
        console.log("Successfully connect to MongoDB.");
        // Verifica se a coleção de roles está vazia
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                console.log('---Initialize datamodel');
                // Inicializa a coleção de roles se a mesma estiver vazia
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

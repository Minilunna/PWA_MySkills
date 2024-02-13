module.exports = {
    mongoose: require('mongoose'),
    user: require("./user.model"),
    role: require("./role.model"),
    skills: require("./skills.model"),
    roles: ["user", "admin", "manager"],
};
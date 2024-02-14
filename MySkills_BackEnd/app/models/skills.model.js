const mongoose = require("mongoose");

const Skill = mongoose.model( "Skill", new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    icon: String
}));

module.exports = Skill;

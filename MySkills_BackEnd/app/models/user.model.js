const mongoose = require("mongoose");

const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  surname: String,
  mobileNumber: String,
  picture: String,
  addressLine1: String,
  addressLine2: String,
  postcode: String,
  state: String,
  area: String,
  education: String,
  country: String,
  stateRegion: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  skills: [{
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill"
    },
    proficiency: String
  }],
}));

module.exports = User;

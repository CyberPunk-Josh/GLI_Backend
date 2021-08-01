const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Modelado:
const UserSchema = Schema({
    name: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: String,
    active: Boolean,
    avatar: String
});

module.exports = mongoose.model("User", UserSchema);
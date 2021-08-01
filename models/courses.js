const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Modelado
const CourseSchema = Schema({
    name: String,
    content: String,
    modules: Number,
    difficulty: String,
    active: String,
});

module.exports = mongoose.model('Course', CourseSchema);
const express = require('express');
const CourseController = require('../controllers/course');

// middlewares
const md_auth = require('../middlewares/authenticated');

const api = express.Router();

// endpoint
api.post('/create-course', [md_auth.ensureAuth], CourseController.createCourse);
api.get('/courses', [md_auth.ensureAuth], CourseController.getAllCourses);
api.put('/update-course/:id', [md_auth.ensureAuth], CourseController.updateCourse);
api.put('/activate-course/:id', [md_auth.ensureAuth], CourseController.activateCourse);
api.delete('/delete-course/:id', [md_auth.ensureAuth], CourseController.deleteCourse);



module.exports = api;
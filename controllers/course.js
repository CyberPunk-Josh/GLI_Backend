const Course = require('../models/courses');

// function to create a new course:
exports.createCourse = async(req, res) => {
    const { name, content, modules, difficulty } = req.body;

    try{
        
        // checking if course already exists
        let course = await Course.findOne({ name });

        if(course){
            res.status(400).send({ message: 'Course already exists'});
            return;
        }

        if(!name || !content || !modules || !difficulty){
            res.status(400).send({ message: 'All fields are required'});
        } else {
            course = new Course(req.body)
            course.name = name;
            course.content = content;
            course.modules = modules;
            course.difficulty = difficulty;
            course.active = "Activo";

            // saving course into database
            await course.save((err, courseStored) => {
                if(err){
                    res.status(500).send({message: 'Server Error'})
                } else {
                    // res.status(200).send({usuario: userStored})
                    res.status(200).send({message: 'Course created successfully'})
                }
            })
        }

    } catch(error){
        console.log(error)
        res.status(400).send({message: 'Something went wrong'})
    }
}

// function to get all courses
exports.getAllCourses = async(req, res) => {
    try{
        await Course.find().then(courses => {
            if(!courses){
                res.status(404).send({message: 'No data for courses'});
            } else {
                res.status(200).send({users: courses} );
            }
        })
    } catch(error){
        console.log(error)
        res.status(400).send({message: 'Something went wrong'})
    }
}

// function to update course
exports.updateCourse = async(req, res) => {
    // data to update
    let courseData = req.body;
    const params = req.params;

    try{
        let courseToUpdate = await Course.findByIdAndUpdate({ _id: params.id }, courseData);

        if(!courseToUpdate){
            res.status(404).send({message: 'Course not found'});
            return;
        } else{
            res.status(200).send({message: 'Course updated successfully!'});
        }

    } catch(error){
        console.log(error);
        res.status(500).send({message: 'Server Error'});
    }
}

// function to activate a course
exports.activateCourse = async(req, res) => {
    const params = req.params;
    const { active } = req.body;

    try {
        let courseToActivate = await Course.findByIdAndUpdate( { _id: params.id} , { active });

        if(!courseToActivate){
            res.status(404).send({message: 'Course not found'});
            return;
        }

        if( active === true ){
            res.status(200).send({message: 'Course activated'});
        } else {
            res.status(200).send({message: 'Course desactivated'});
        }

    } catch(error){
        console.log(error);
        res.status(500).send({message: 'Server Error'});
    }
}

// function to delete a course
exports.deleteCourse = async(req, res) => {
    const params = req.params;

    try{
        let courseDeleted = await Course.findByIdAndRemove( { _id: params.id});

        if(!courseDeleted){
            res.status(404).send({message: 'Course not found'});
            return;
        } else {
            res.status(200).send({message: 'Course deleted'});
        }
    } catch(error){
        console.log(error);
        res.status(500).send({message: 'Server Error'});
    }
}
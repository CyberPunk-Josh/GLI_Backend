const path = require('path');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const jwt = require('../services/jwt');
const User = require('../models/user');


// function to create a user:
exports.signUp = async(req, res) => {
    const {name, lastName, email, password, repeatPassword} = req.body;
    try{
        // checking if user already exists
        let usuario = await User.findOne({ email });
        
        if(usuario){
            res.status(400).send({message: 'User already exists'})
            return;
        }

        if(!password || !repeatPassword){
            res.status(400).send({message: 'Passwords are mandatory'})
        } else if(password !== repeatPassword) {
            res.status(400).send({message: 'Passwords must match'})
        } else {
            usuario = new User(req.body)
            usuario.name = name;
            usuario.lastName = lastName;
            usuario.email = email;
            usuario.role = 'admin';
            usuario.active = true;

            // hasing password
            const salt = await bcryptjs.genSalt(10);
            usuario.password = await bcryptjs.hash(password, salt);

            // saving the user into db:
            await usuario.save((err, userStored) => {
                if(err){
                    res.status(500).send({message: 'Server Error'})
                } else {
                    // res.status(200).send({usuario: userStored})
                    res.status(200).send({message: 'User created successfully'})
                }
            })
        }

    } catch(error){
        console.log(error)
        res.status(400).send({message: 'Something went wrong'})
    }
};

// funtion to singIn:
exports.singIn = async function(req, res){
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    // userStored es el objeto donde se guarda el usuario
    User.findOne({email},  async (err, userStored) => {
        if (err) {
            res.status(500).send({message: 'Server Error'});
        } else {
            if (!userStored) {
                res.status(400).send({message: 'User not found'});
            } else {
                // comparing hashed passwords
                const correctPassword = await bcryptjs.compare(password, userStored.password)

                if(!correctPassword) {

                    res.status(400).send({message: 'Incorrect Password'});
                    
                } else if (!userStored.active){

                    res.status(200).send({code: 200, message: 'User not active'});

                } else {
                    res.status(200).send({

                        accessToken : jwt.createAccessToken(userStored),
                        refreshToken : jwt.createRefreshToken(userStored)

                    })
                }
            }
        }
    })
};

// get users:
exports.getUsers = async(req, res, next) => {
    try {
        await User.find().then(users => {
            if(!users){
                res.status(404).send({message: 'No data for users'});
            } else {
                res.status(200).send({users: users} );
            }
        })
    } catch(error){
        console.log(error)
        res.status(400).send({message: 'Something went wrong'})
    }
}

// get active users:
exports.getUsersActive = async(req, res, next) => {

    const query = req.query;

    try {
        await User.find({ active: query.active }).then(users => {
            if(!users){
                res.status(404).send({message: 'No data for active users'});
            } else {
                res.status(200).send({users: users} );
            }
        })
    } catch(error){
        console.log(error)
        res.status(500).send({message: 'Something went wrong'});
    }
}

// upload avatar
exports.uploadAvatar = async(req, res) => {
    const params = req.params;

    try{
        await User.findById({ _id: params.id }, (err, userData) => {
            if(!userData){
                res.status(404).send({message: 'User not found'});
            } else {
                let user = userData;
                
                if(req.files){
                    // getting name
                    let filepath = req.files.avatar.path;
                    let fileSplit = filepath.split("\\");
                    let fileName = fileSplit[2];

                    // getting extension
                    let exSplit = fileName.split('.');
                    let fileExtension = exSplit[1];

                    if(fileExtension !== 'png' && fileExtension !== 'jpg'){
                        res.status(400).send({message: 'Image extension not allowed'});
                        return;
                    } else {
                        user.avatar = fileName;
                        // updating user:
                        User.findByIdAndUpdate({ _id: params.id }, user, (err, userResult) => {
                            if(err){
                                console.log(error);
                                res.status(500).send({message: 'Something went wrong'});
                                return;
                            } else{
                                res.status(200).send({ avatarName: fileName});
                            }
                        })
                    }
                }
            }
        })

    } catch(error){{
        console.log(error);
        res.status(500).send({message: 'Server Error'});
    }}
}

// get avatar image url
exports.getAvatar = async(req, res) => {
    const avatarName = req.params.avatarName;
    const filepath = `uploads/avatar/${avatarName}`;

    await fs.access(filepath, error => {
        if(error){
            res.status(404).send({message: 'File does not exist'});
            return;
        } else{
            res.sendFile(path.resolve(filepath));
        }
    })
}

// update user
exports.updateUser = async(req, res) => {
    // data to update
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    // id to find user
    const params = req.params;

    // encrypting password when user edit an item
    if(userData.password){
        // hasing password
        const salt = await bcryptjs.genSalt(10);
        userData.password = await bcryptjs.hash(userData.password, salt);
    }

    try {
        let userToUpdate = await User.findByIdAndUpdate({ _id: params.id}, userData);

        if(!userToUpdate) {
            res.status(404).send({ message: 'User not found' });
            return;
        } else {
            res.status(200).send({ message: 'User updated' });
        }
    } catch(error){
        console.log(error);
        res.status(500).send({message: 'Server Error'});
    }
}

// activate users
exports.activateUser = async (req, res) => {
    const params = req.params;
    const { active } = req.body;

    try{
        let userToActivate = await User.findOneAndUpdate( { _id: params.id} , { active });
        
        if(!userToActivate){
            res.status(404).send({message: 'User not found'});
            return;
        }

        if( active === true ){
            res.status(200).send({message: 'User activated'});
        } else {
            res.status(200).send({message: 'User desactivated'});
        }

    } catch(error){
        console.log(error);
        res.status(500).send({message: 'Server Error'});
    }
}

// delete user
exports.deleteUser = async (req, res) => {
    const params = req.params;

    try{
        let userDeleted = await User.findByIdAndRemove( { _id: params.id});

        if(!userDeleted){
            res.status(404).send({message: 'User not found'});
            return;
        } else {
            res.status(200).send({message: 'User deleted'});
        }
    } catch(error){
        console.log(error);
        res.status(500).send({message: 'Server Error'});
    }
}

// create user has admin
exports.signUpAdmin = (req, res) => {
    console.log('signUpAdmin...');
}
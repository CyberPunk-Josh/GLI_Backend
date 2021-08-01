const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = 'JOSHUE123';


// function to create access token
exports.createAccessToken = function(user) {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createToken: moment().unix(),
        exp: moment().add(3, 'hours').unix()
    };
    
    return jwt.encode(payload, SECRET_KEY);
}

// funtion for refresh token
exports.createRefreshToken = function(user){
    const payload = {
        id: user._id,
        exp: moment().add(30, 'days').unix(),
    };

    return jwt.encode(payload, SECRET_KEY);
}

// function to decode access token
exports.decodeToken = function(token){
    return jwt.decode(token, SECRET_KEY, true);
}
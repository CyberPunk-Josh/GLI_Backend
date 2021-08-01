const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = 'JOSHUE123';


exports.ensureAuth = async (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({ message: 'Missing authorization headers'});
    }

    const token = await req.headers.authorization.replace(/['"]+/g, "");

    try {
        let payload = jwt.decode(token, SECRET_KEY);

        if(payload.exp <= moment.unix()){
            res.status(404).send({ message: 'Token has expired' });
            return
        }

    } catch(ex) {
        // console.log(ex);
        res.status(404).send({ message: 'Invalid token' });
        return
    }

    let payload = jwt.decode(token, SECRET_KEY);
    req.user = payload;
    next();
}
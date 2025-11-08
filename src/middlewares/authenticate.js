const passport = require('passport')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function checkAdminRole (req, res, next)  {
    try {
        const currRole = req.user.role;
        console.log(req.user.role)

        if (currRole === 'admin'){
            return next();
        } else{
            return res.status(403).send('You\'re not permitted to access this page!')
        }
    } catch (err) {
        return next(err)
    }
}

async function generateToken(userId){
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '1h'})
}

const passportAuth = passport.authenticate('jwt', { session: false });

module.exports = {
    checkAdminRole,
    passportAuth,
    generateToken,

}
const passport = require('passport')
const jwt = require('jsonwebtoken');
const { findBlacklistedToken } = require('../models/jwt_blacklist_model.js')
require('dotenv').config()

async function checkAdminRole (req, res, next)  {
    try {
        //console.log(req.user)
        //const currRole = req.user.role;
        //console.log(req.user.role)

        if (req.user?.role === 'admin'){
            return next();
        } else{
            return res.status(403).json({message: 'You\'re not permitted to access this page!'})
        }
    } catch (err) {
        return next(err)
    }
}

async function isTokenBlacklisted(req, res, next){
    try {
        const header = req.headers['authorization']
        if (!header || !header.startsWith('Bearer ')){
            return res.status(400).json({message: "Not a bearer token!"})
        }

        const token  = header.split(' ')[1]
        const blacklisted = await findBlacklistedToken(token)

        if (blacklisted){
            //console.log('yes your token is blacklisted')
            return res.status(401).json({message: "Your session has expired!"})
        } else{
            return next();
        }
    } catch (err){
        return next(err)
    }
}

async function optionalLogin(req, res, next){
    try{
        const header = req.headers['authorization']

        if (!header || !header.startsWith('Bearer ')){
            req.user = undefined
            return next()
        }

        const token  = header.split(' ')[1]
        if (!token){
            req.user = undefined
            return next()
        }

        const blacklisted = await findBlacklistedToken(token)
        if (blacklisted){
            req.user = undefined
            return next()
        }
        //const authMiddleware = 
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (user) {
                req.user = user;
            } else{
                req.user = undefined
            }
            return next();
        })(req, res, next);
        //authMiddleware(req, res, next);
    } catch (err){
        return next(err);
    }
}


async function generateToken(user){
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '1h'})
}

const passportAuth = passport.authenticate('jwt', { session: false });

module.exports = {
    checkAdminRole,
    passportAuth,
    generateToken,
    isTokenBlacklisted,
    optionalLogin
}
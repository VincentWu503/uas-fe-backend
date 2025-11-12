const usersModel = require('../models/users_model.js');
const { addToBlacklist } = require('../models/jwt_blacklist_model.js')
const pass = require('../utils/password_encryptor.js');
const { validationResult } = require('express-validator'); 
const pwd = require('../utils/password_encryptor.js')
const auth = require('../middlewares/authenticate.js')

exports.userLogin = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body
       
        const user = await usersModel.findUserByEmail(email);
        if (!user){
            return res.status(401).send("Invalid email or password!")
        }
        
        const passwordValid = await pwd.checkDbHash(password, user.password);

        if (!user || !passwordValid){
            return res.status(401).send("Invalid email or password!");
        }

        const jwtToken = await auth.generateToken(user.id)
        if(!jwtToken){
            return res.status(401).send('Failed to generate token!')
        }

        return res.status(200).json({token: jwtToken})
    } catch (err) {
        return next(err);
    }
}

exports.userLogout = async (req, res, next) => {
    try {
        const header = req.headers['authorization']
        if (!header || !header.startsWith('Bearer ')){
            return res.status(400).send("Invalid token!");
        }

        const token = header.split(' ')[1];
        const blacklisted = await addToBlacklist(token);
        if (!blacklisted){
            return res.status(500).send("Failed to log out!")
        } else{
            return res.status(200).send("Successfully logged out from current session.")
        }
    } catch (err){
        return next(err);
    }
}

exports.getAllUsers = async (req, res, next) =>{
    console.log('attached current user', req.user)
    try {
        const users = await usersModel.findAll();

        if (users) return res.status(200).json(users);
    } catch (err) {
        return next(err);
    }  
}

exports.createUser = async (req, res, next) => {
    try{
        const validationError = validationResult(req)
        if (!validationError.isEmpty()){
            return res.status(400).json(validationError);
        }
        const {
            username,
            email,
            password,
            confirm_password
        } = req.body;

        const dbEmail = await usersModel.findUserByEmail(email);
        if (dbEmail){
            return res.status(409).send("Email already exists!");
        }

        const confirmMatched = (password === confirm_password) ? true : false

        let hashedPassword;
        if (confirmMatched){
            hashedPassword = await pass.hashPassword(password)
        } else{
            return res.status(400).send("Password and confirm password doesn't match!")
        }
       
        const created = await usersModel.createUser(
            username,
            email,
            hashedPassword,
        )   

        if (created) return res.status(201).send("User created successfully.");
    } catch (err) {
        return next(err);
    }
}

// exports.updateUserInfo = async (req, res, next) => {
//     try{
//         const validationError = validationResult(req)
//         if (!validationError.isEmpty()){
//             return res.status(400).json(validationError);
//         }
        
//         const {
//             newUsername,
//             newEmail,
//         } = req.body;        
//         const userId = req.params.id;
//         const user = await usersModel.findUserById(userId);

//     } catch (err) {
//         return next(err)
//     }
// }
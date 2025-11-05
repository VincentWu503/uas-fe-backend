const usersModel = require('../models/users_model.js');
const pass = require('../utils/password_encryptor.js');
const { validationResult } = require('express-validator');

// TO-DO :  - CREATE UPDATE USER INFO 
//          - CREATE UPDATE USER PASSWORD
//          - CREATE DELETE USER API
// TO-DO :  - CREATE USER LOGIN AND LOGOUT  

exports.userLogin = async (req, res, next) => {

}

exports.userLogout = async (req, res, next) => {

}

exports.getAllUsers = async (req, res, next) =>{
    try {
        const users = await usersModel.fetchAll();

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

        const dbUsername = await usersModel.checkUsername(username);
        if (dbUsername.length > 0){
            return res.status(409).send("Username already exists!");
        }

        const dbEmail = await usersModel.checkEmail(email);
        if (dbEmail.length > 0){
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

exports.updateUserInfo = async (req, res, next) => {
    try{
        const validationError = validationResult(req)
        if (!validationError.isEmpty()){
            return res.status(400).json(validationError);
        }
        
        const {
            newUsername,
            newEmail,
        } = req.body;
        
        const userId = req.params.id;
        const user = await usersModel.fetchUser(userId);

    } catch (err) {
        return next(err)
    }
}
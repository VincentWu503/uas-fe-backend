const usersModel = require("../models/users_model.js");
const { addToBlacklist } = require("../models/jwt_blacklist_model.js");
const pass = require("../utils/password_encryptor.js");
const { validationResult } = require("express-validator");
const pwd = require("../utils/password_encryptor.js");
const auth = require("../middlewares/authenticate.js");

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("Login attemp for email:", email);
    console.log("Provided Password:", password);

    const user = await usersModel.findUserByEmail(email);
    console.log("User found:", user);

    if (!user) {
      console.log("No user found with email:", email);
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // console.log("Stored hashed password:", user.password);

    const passwordValid = await pwd.checkDbHash(password, user.password);
    // console.log("Password validation result:", passwordValid);

    if (!passwordValid) {
      //!user w hapus karena udah di cek di bagian atas
      console.log("Password validation failed");
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const jwtToken = await auth.generateToken(user);
    if (!jwtToken) {
      return res.status(401).json({ message: "Failed to generate token!" });
    }

    console.log("Login successful for user:", user.email);

    return res.status(200).json({
      message: "Login Successful",
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return next(err);
  }
};

exports.userLogout = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Invalid token!" });
    }

    const token = header.split(" ")[1];
    const blacklisted = await addToBlacklist(token);
    if (!blacklisted) {
      return res.status(500).json({ message: "Failed to log out!" });
    } else {
      return res
        .status(200)
        .json({ message: "Successfully logged out from current session." });
    }
  } catch (err) {
    return next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  // console.log('attached current user', req.user)
  try {
    const users = await usersModel.findAll();

    if (users) return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

exports.getUserInfoById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await usersModel.findOne(userId);

    if (user) return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
    try{
        const user = req.user
        if (!user) return res.status(401).json({message: "You\'re not logged in!"});
        else return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (err){
        return next(err);
    }
}

exports.createUser = async (req, res, next) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json(validationError);
    }
    const { username, email, password, confirm_password } = req.body;

    const dbEmail = await usersModel.findUserByEmail(email);
    if (dbEmail) {
      return res.status(409).json({ message: "Email already exists!" });
    }

    const confirmMatched = password === confirm_password ? true : false;
    // console.log(confirmMatched);
    // console.log(password);
    // console.log(confirm_password);

    let hashedPassword;
    if (confirmMatched) {
      hashedPassword = await pass.hashPassword(password);
    } else {
      return res
        .status(400)
        .json({ message: "Password and confirm password doesn't match!" });
    }

    const created = await usersModel.createUser(
      username,
      email,
      hashedPassword
    );

    if (created)
      return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try{
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
        return res.status(400).json(validationError);
    }

    const {
        email,
        new_password,
        confirm_new_password
    } = req.body

    const dbEmail = await usersModel.findUserByEmail(email);
    if (!dbEmail){
        return res.status(404).json({message: "Email doesn't exists!"});
    }

    const confirmMatched = (new_password === confirm_new_password) ? true : false

    let hashedPassword;
    if (confirmMatched){
        hashedPassword = await pass.hashPassword(new_password)
    } else{
        return res.status(400).json({message: "Password and confirm password doesn't match!"})
    }

    const updated = await usersModel.resetPassword(
        email,
        hashedPassword,
    )   

    if (updated) return res.status(200).json({message: "Password updated successfully."});
  } catch (err){
      return next(err);
  }
}

exports.updateUserInfo = async (req, res, next) => {
  try {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()){
      return res.status(400).json(validationError);
    }

    const userId = req.user.id

    const {
      new_username,
      new_email,
      password
    } = req.body

    if (new_email === req.user.email){
      return res.status(400).json({message: "Please provide email different than your current email!"})
    }

    const user = await usersModel.findUserPayloadById(userId);
    const emailExists = await usersModel.findUserByEmail(new_email);
    if (emailExists){
      return res.status(400).json({message: "Provided email already exists!"})
    }

    const passwordValid = await pwd.checkDbHash(password, user.password);

    if (!passwordValid) {
      // console.log("Password validation failed");
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    let updates = {}

    // updates json field must match with db column name for corresponding data
    if (new_username !== undefined) updates.username = new_username;
    if (new_email !== undefined) updates.email = new_email;

    let isRequestEmpty = false;
    for (var prop in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, prop)) {
            isRequestEmpty = true;
        }
    }

    if (!isRequestEmpty) {
        return res.status(400).json({ message: "No valid update fields provided." });
    }

    const updated = await usersModel.updateUserInfo(updates, userId);

    if (updated) return res.status(200).json({
      message: 'Successfully updated username',
      updated
    })
  } catch (err) {
    return next(err);
  }
}

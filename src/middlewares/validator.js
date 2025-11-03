const { body } = require('express-validator')

exports.createUserValidator = [
    body('username').notEmpty().withMessage('Username is required!'),
    body('email').isEmail().notEmpty().withMessage('Invalid email address!'),
    body('password').isLength({min: 8, max: 255})
    .withMessage(('Password length must be at least 8 characters long!'))
];
const foodsModel = require('../models/foods_model.js');
const { validationResult } = require('express-validator');

// TO-DO :  - Implement dynamic query pagination for fetching foods item
//          - Create food item uploader API
//          - Create deletion API
exports.getFoods = async (req, res, next) =>{
    try {
        const foods = await foodsModel.fetchAll();

        if (foods) return res.status(200).json(foods);
    } catch (err) {
        return next(err);
    }  
}

exports.addFood = async (req, res, next) => {
    try {
        const validationError = validationResult(req)
        if (!validationError.isEmpty()){
            return res.status(400).json(validationError);
        }
        const {
            item_name,
            category,
            dine_in_price,
            online_price,
            description,
            image_url
        } = req.body;

        if (foods) return res.status(200).json(foods);
    } catch (err) {
        return next(err);
    }  
}
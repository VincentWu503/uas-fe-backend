const reviewModel = require('../models/restaurant_reviews_model.js');
const { validationResult } = require('express-validator');

exports.getRestaurantReviews = async (req, res, next) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        const reviews = await reviewModel.findAll(limit, offset);
        if (!reviews){
            return res.status(500).send("Failed to fetch food reviews")
        } else{
            return res.status(200).json(reviews)
        }
    } catch (err) {
        return next(err);
    }  
}

exports.addRestaurantReview = async (req, res, next) => {
    try{
        const validationError = validationResult(req);
        if (!validationError.isEmpty()){
            return res.status(400).json(validationError);
        }
        const foodId = req.params.id
        const user = req.user;
        const userId = user ? user.id : null

        const {
            stars,
            comment,
            overview
        } = req.body

        let tempOverview = overview
        if (tempOverview === undefined || tempOverview === null){
            tempOverview = 'lainnya';
        }

        const review = await reviewModel.addReview(stars, comment, tempOverview, userId);
        if (!review){
            return res.status(500).send("Failed to add food review!");;
        } else{
            return res.status(201).json({message: "Food review added successfully.", review})
        }
    } catch (err){
        return next(err);
    }
}
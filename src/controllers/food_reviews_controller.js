const reviewModel = require('../models/food_reviews_model.js');
const { validationResult } = require('express-validator');

exports.getFoodReviews = async (req, res, next) =>{
    try {
        const foodId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        const reviews = await reviewModel.findAll(foodId, limit, offset);
        if (!reviews){
            return res.status(500).json({message: "Failed to fetch food reviews"})
        } else{
            return res.status(200).json(reviews)
        }
    } catch (err) {
        return next(err);
    }  
}

exports.getFoodReviewsOverview = async (req, res, next) => {
    try{
        const foodId = req.params.id;

        const overview = await reviewModel.getFoodReviewsOverview(foodId)

         if (!overview){
            return res.status(500).json({message: "Failed to fetch food reviews overview!"})
        } else{
            const averageRating = parseFloat(overview.average_stars)
            const ratingCount = parseInt(overview.total_reviews)
            return res.status(200).json({
                average_rating: averageRating,
                review_count: ratingCount
            })
        }
    } catch (err) {
        return next(err)
    }
}

exports.addFoodReview = async (req, res, next) => {
    try{
        const validationError = validationResult(req);
        if (!validationError.isEmpty()){
            return res.status(400).json(validationError);
        }
        const foodId = req.params.id

        const {
            stars,
            comment,
        } = req.body

        const review = await reviewModel.addFoodReview(stars, comment, foodId);
        if (!review){
            return res.status(500).json({message: "Failed to add food review!"});
        } else{
            return res.status(201).json({message: "Food item added successfully."})
        }
    } catch (err){
        return next(err);
    }
}
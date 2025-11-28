const reviewModel = require('../models/restaurant_reviews_model.js');
const { validationResult } = require('express-validator');

exports.getRestaurantReviews = async (req, res, next) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        const reviews = await reviewModel.findAll(limit, offset);
        if (!reviews){
            return res.status(500).json({message: "Failed to fetch food reviews"})
        } else{
            // count total review restoran dan rata2 bintang (bukan review makanan)
            const count = await reviewModel.countReviews();
            const countNumber = parseInt(count)
            const average  = await reviewModel.countAverageRating();
            const averageNumber = parseFloat(average);
            // console.log('this is my average rating', averageNumber)
            return res.status(200).json({
                count: countNumber,
                average_stars: averageNumber,
                reviews
            })
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
        const user = req.user;
        const userId = user ? user.id : null

        const {
            stars,
            comment,
            overviews
        } = req.body

        let tempOverviews = overviews
        if (tempOverviews === undefined || tempOverviews === null){
            tempOverviews = ['lainnya'];
        }

        const review = await reviewModel.addReview(stars, comment, tempOverviews, userId);
        if (!review){
            return res.status(500).json({message: "Failed to add food review!"});
        } else{
            return res.status(201).json({message: "Food review added successfully.", review})
        }
    } catch (err){
        return next(err);
    }
}
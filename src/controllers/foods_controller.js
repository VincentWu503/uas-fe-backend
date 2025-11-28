const foodsModel = require('../models/foods_model.js');
const { validationResult } = require('express-validator');

exports.getFoods = async (req, res, next) =>{
    const categories = ['main-dish', 'beverages', 'vegetables', 'add-on']
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const category = req.query.category;
        const offset = (page - 1) * limit;

        if (category && !categories.includes(category)){
            return res.status(400).json({
                message: "Category parameters must be main-dish, beverages, vegetables, or add-on!"
            })
        }

        let dbFoods;
        if (!category){
            count = await foodsModel.countFoods();
            dbFoods = await foodsModel.findAll(limit, offset);
        } else{
            count = await foodsModel.countByCategory(category);
            dbFoods = await foodsModel.findAllByCategory(category, limit, offset);
        }

        if(!dbFoods) return res.status(500).json({message: "Error on fetching foods data."});

        let result = []
        dbFoods.forEach(food => {
            const base64Str = food.image_bytes.toString('base64');
            let obj = { 
                item_id: food.item_id,
                item_name: food.item_name,
                category: food.category,
                dine_in_price: food.dine_in_price,
                online_price: food.online_price,
                description: food.description,
                created_at: food.created_at,
                updated_at: food.updated_at,
                image_data_url: `data:image/${food.image_format};base64,${base64Str}`
            }
            result.push(obj)
        });

        let countNumber;
        if (count) countNumber = parseInt(count)
        return res.status(200).json({
            message: "Fetched foods on database.",
            count: countNumber,
            currPage: page,
            itemsPerPage: limit,
            result
        });
    } catch (err) {
        return next(err);
    }  
}

exports.getFoodById = async (req, res, next) => {
    try{
        const foodId = req.params.id

        const food =  await foodsModel.findOne(foodId);

        const base64Str = food.image_bytes.toString('base64');
        if (food){
            return res.status(200).json({
                message: `Fetched food with item_id ${foodId}`,
                item_id: food.item_id,
                item_name: food.item_name,
                category: food.category,
                dine_in_price: food.dine_in_price,
                online_price: food.online_price,
                description: food.description,
                created_at: food.created_at,
                updated_at: food.updated_at,
                image_data_url: `data:image/${food.image_format};base64,${base64Str}`
            });
        } else{
            return res.status(404).json({message: "Food item doesn't exists!"})
        }
    } catch (err) {
        return next(err)
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
            image_base64_url
        } = req.body;

        let tempCategory = category;
        if (tempCategory === undefined || tempCategory === null){
            tempCategory = 'main-dish'
        }
        let tempDesc = description
        if (tempDesc === undefined || tempDesc === null){
            tempDesc = ''
        }

        let imageFormat;
        let imageBuffer;

        if (image_base64_url && typeof image_base64_url === 'string') {
            const matched = image_base64_url.match(/^data:image\/(\w+);base64,/);
            // console.log('dasfas', matched)
            if (matched) {
                imageFormat = matched[1]; 
                console.log(image_base64_url.split(',')[1])

                imageBuffer = Buffer.from(image_base64_url.split(',')[1], 'base64');
            } else {
                return res.status(400).json({message: "Invalid image data!"})
            }
        }

        const success = await foodsModel.addFood(
            item_name,
            tempCategory,
            dine_in_price,
            online_price,
            tempDesc,
            imageFormat,
            imageBuffer,
        )
        console.log('addFood returned:', success);
        if (success) return res.status(200).json({message: "Item added successfully.", success});
        // If success is falsy, respond with 500 so frontend doesn't assume success
        return res.status(500).json({ message: 'Failed to add item', success });
    } catch (err) {
        return next(err);
    }  
}

exports.updateFoodById = async (req, res, next) => {
    try {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()){
            return res.status(400).json(validationError);
        }
        const foodId = req.params.id;

        const exists = await foodsModel.findOne(foodId);
        if (!exists) {
            return res.status(404).json({message: "Food item doesn't exists!"});
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }

        const {
            item_name,
            category,
            dine_in_price,
            online_price,
            description,
            image_base64_url
        } = req.body;

        const updates = {};

        if (item_name !== undefined) updates.item_name = item_name;
        if (category !== undefined) updates.category = category;
        if (dine_in_price !== undefined) updates.dine_in_price = dine_in_price;
        if (online_price !== undefined) updates.online_price = online_price;
        if (description !== undefined) updates.description = description;

        if (image_base64_url && typeof image_base64_url === 'string') {
            const matched = image_base64_url.match(/^data:image\/(\w+);base64,/);
            if (matched) {
                updates.image_format = matched[1]; 
                updates.image_bytes = Buffer.from(image_base64_url.split(',')[1], 'base64');
            } else {
                return res.status(400).json({message: "Invalid image data!"});
            }
        }

        let isRequestEmpty = false;
        for (var prop in updates) {
            if (Object.prototype.hasOwnProperty.call(updates, prop)) {
                isRequestEmpty = true;
            }
        }

        if (!isRequestEmpty) {
            return res.status(400).json({ message: "No valid update fields provided." });
        }

        console.log(updates)
        const updatedFood = await foodsModel.updateFood(foodId, updates);
        
        return res.status(200).json({message: "Item updated successfully.", updatedFood});

    } catch (err) {
        return next(err);
    }
}

exports.deleteFoodById = async (req, res, next) => {
    try{
        const foodId = req.params.id

        const exists = await foodsModel.findOne(foodId);;

        if (!exists){
            return res.status(404).json({message: "Food item doesn't exists!"})
        }

        const food =  await foodsModel.deleteFood(foodId);
        if (food) return res.status(200).json({message: "Item deleted successfully.", food});
    } catch (err) {
        return next(err)
    }
}
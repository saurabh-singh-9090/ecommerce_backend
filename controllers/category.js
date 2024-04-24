const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Category not found in DB"
            })
        }
        req.category = cate;
        next();
    })
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Not able to save category into the DB"
            });
        }
        res.json({category});
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No categories found in DB"
            });
        }
        res.json(categories);
    });
};

/*
   Here, ':categoryId' calls 'getCategoryById' middleware which then returns 'req.category' 
   containg name of the category which is then updated in the following 'updateCategory' 
   method
*/
exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name; //'req.body.name' is the updated name we pass through our front-end
    
    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to update the category"
            });
        }
        res.json(updatedCategory);
    });
};

exports.removeCategory = (req, res) => {
    const category = req.category; //'req.category' is obtained from 'getCategoryById' middleware
    
    //'remove' method is coming from mongoose module
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete this category"
            });
        }
        res.json({
            message: "Successfully deleted"
        });
    });
};
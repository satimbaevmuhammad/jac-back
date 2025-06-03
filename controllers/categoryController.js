const Category = require('../models/categoryModel');

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.status(201).json(category);
};

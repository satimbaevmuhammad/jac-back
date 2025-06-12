const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Agar category nomi bilan kelsa (string bo‘lsa), uni ObjectId ga aylantiramiz
    if (productData.category && typeof productData.category === 'string') {
      if (productData.category.length === 24) {
        const categoryExists = await Category.findById(productData.category);
        if (!categoryExists) {
          return res.status(400).json({ 
            error: 'Category not found', 
            details: `Category with ID "${productData.category}" does not exist.` 
          });
        }
      } else {
        const category = await Category.findOne({ name: productData.category });
        if (!category) {
          return res.status(400).json({ 
            error: 'Category not found', 
            details: `Category with name "${productData.category}" does not exist. Please create the category first.`,
            availableCategories: await Category.find({}, 'name _id')
          });
        }
        productData.category = category._id;
      }
    }

    const product = new Product(productData);
    await product.save();
    await product.populate('category');

    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.message,
        hint: 'Make sure all required fields are provided and category exists'
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (productData.category && typeof productData.category === 'string') {
      if (productData.category.length === 24) {
        const categoryExists = await Category.findById(productData.category);
        if (!categoryExists) {
          return res.status(400).json({ 
            error: 'Category not found', 
            details: `Category with ID "${productData.category}" does not exist.` 
          });
        }
      } else {
        const category = await Category.findOne({ name: productData.category });
        if (!category) {
          return res.status(400).json({ 
            error: 'Category not found', 
            details: `Category with name "${productData.category}" does not exist.`,
            availableCategories: await Category.find({}, 'name _id')
          });
        }
        productData.category = category._id;
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true
    }).populate('category');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.message 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Optional: to help frontend list categories before creating product
exports.getAvailableCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, 'name _id');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

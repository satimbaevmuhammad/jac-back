const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate('category');
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

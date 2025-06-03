const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // UUID generator

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    default: () => uuidv4(), // Har bir mahsulot uchun unique ID (masalan: '8c0f2d78-5ac0-4d93-a48a-ef7c9b67c14a')
  },

  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  shortDescription: { type: String },

  price: { type: Number, required: true },

  images: [{ type: String }],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  tags: [{ type: String }],

  specs: {
    engineType: { type: String },
    weightRange: { type: String },
    model: { type: String },
    manufacturer: { type: String },
  },

  stock: { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);

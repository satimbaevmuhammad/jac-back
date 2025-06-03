const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

mongoose.connect('mongodb+srv://satimbaevmuhammad3:Fr9CVM3AvMUIUpsL@cluster0.caiojdv.mongodb.net/')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () =>
      console.log(`Server running on http://localhost:3000`)
    );
  })
  .catch((err) => console.error(err));

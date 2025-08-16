const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const sequelize = new Sequelize('product_viewer', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false // Disable logging for cleaner console output
});

// Import models
const Product = require('./models/product.model')(sequelize, Sequelize.DataTypes);
const User = require('./models/user.model')(sequelize, Sequelize.DataTypes);

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    // Sync all models
    sequelize.sync().then(() => {
      console.log('Database & tables created!');
    });
  })
  .catch(err => console.log('Error: ' + err));

// Auth Routes
app.use('/api/auth', require('./routes/auth.routes'));

// Product Routes
// GET all products (Publicly accessible)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product (Protected - requires authentication)
app.get('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product === null) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const db = require('./models'); // Import the centralized db object
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
// app.use(cors({
//   origin: process.env.BASE_URL,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }));
app.use(express.json());

// PostgreSQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,   // make sure port is included
    dialect: process.env.DB_DIALECT || "postgres",
    logging: false, // Disable logging for cleaner console output
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // allow self-signed certs (RDS usually works with this)
      },
    },
  }
);

db.sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected');
    // Sync all models
    db.sequelize.sync().then(() => {
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
    const products = await db.Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product (Protected - requires authentication)
app.get('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
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
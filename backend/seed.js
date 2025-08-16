const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

// Initialize Sequelize
const sequelize = new Sequelize('product_viewer', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

// Import the models
const Product = require('./models/product.model')(sequelize, Sequelize.DataTypes);
const User = require('./models/user.model')(sequelize, Sequelize.DataTypes);

const products = [
  {
    name: 'Modern Chair',
    image: '/images/chair.png',
    category: 'Furniture',
    price: 150,
    modelPath: '/models/chair.glb'
  },
  {
    name: 'Classic Armchair',
    image: '/images/armchair.png',
    category: 'Furniture',
    price: 250,
    modelPath: '/models/arm_chair__furniture.glb'
  },
  {
    name: 'Bar Stool',
    image: '/images/barstool.png',
    category: 'Furniture',
    price: 80,
    modelPath: '/models/bar_stool.glb'
  },
  {
    name: 'A Couch',
    image: '/images/couch.png',
    category: 'Furniture',
    price: 550,
    modelPath: '/models/a_couch.glb'
  },
  {
    name: 'Clock',
    image: '/images/clock.png',
    category: 'Decor',
    price: 75,
    modelPath: '/models/clock.glb'
  }
];

const seedDatabase = async () => {
  try {
    // Sync the model with the database, dropping the table if it exists
    await sequelize.sync({ force: true });

    // Create default user
    await User.create({
      username: 'testuser',
      password: 'password123' // This will be hashed by the User model's beforeCreate hook
    });
    console.log('Default user created: testuser/password123');

    // Bulk create the products
    await Product.bulkCreate(products);
    console.log('Database seeded successfully with 5 models!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
};

seedDatabase();

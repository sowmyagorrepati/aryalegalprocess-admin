const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const companyRoutes = require('./routes/companies'); // company routes file (create this)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://sowmyagorrepati.github.io', 
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// --- Connect to MongoDB for Products ---
const productConnection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
productConnection.once('open', () => {
  console.log('Connected to product database');
});

// --- Connect to MongoDB for Companies ---
const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
companyConnection.once('open', () => {
  console.log('Connected to company database');
});

// Inject connections into models
// For products - your existing model file uses mongoose.model, so adjust accordingly or pass connection if needed.

// Use routes, pass connections if you want separate model binding:
app.use('/api/products', productRoutes);
app.use('/api/companies', companyRoutes);

// Start the server only when both DB connections are open
Promise.all([
  new Promise(resolve => productConnection.once('open', resolve)),
  new Promise(resolve => companyConnection.once('open', resolve))
]).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error connecting to databases:', err);
});

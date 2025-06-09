const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
// companyRoutes is now a function accepting the Company model
const companyRoutes = require('./routes/companies');

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

// Define Company schema and model on companyConnection
const companySchema = new mongoose.Schema({
  companyName: String,
  status: String,
  startDate: String,
  endDate: String,
  contactName: String,
  contactNumber: String,
  contactEmail: String,
  address: String
});
const Company = companyConnection.model('Company', companySchema);

// Use routes
app.use('/api/products', productRoutes);  // assuming productRoutes is a normal router

// Pass the Company model instance to the company routes function
app.use('/api/companies', companyRoutes(Company));

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

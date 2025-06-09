const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
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

productConnection.on('error', (err) => {
  console.error('Product DB connection error:', err);
});

productConnection.once('open', () => {
  console.log('Connected to product database');
});

// --- Connect to MongoDB for Companies ---
const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

companyConnection.on('error', (err) => {
  console.error('Company DB connection error:', err);
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
app.use('/api/products', productRoutes);

// Pass the Company model instance to the company routes function
app.use('/api/companies', companyRoutes(Company));

// Start server only when both DB connections are ready
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
// Catch-all for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});
app.get('/test', (req, res) => {
  res.send('Backend is alive');
});

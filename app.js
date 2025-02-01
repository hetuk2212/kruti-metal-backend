const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRouts');
const { port } = require('./config/config');

const app = express();

// Enable CORS for specific origins (local and live)
app.use(cors({
  origin: ['http://localhost:3000', 'https://kruti-metal-backend.onrender.com'], // Add your live domain here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Fetching all users' });
});
app.use('/api/users', userRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

module.exports = app;

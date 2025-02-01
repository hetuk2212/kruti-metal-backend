const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();  // Add this line to load environment variables from .env

const { MONGO_URI, PORT } = process.env;  // Get DB_URI and PORT from environment variables

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

require('dotenv').config();

module.exports = {
  db: process.env.MONGO_URI,
  port: process.env.PORT,
};

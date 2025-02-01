const User = require('../models/userModal'); // Assuming you're using Mongoose

exports.register = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

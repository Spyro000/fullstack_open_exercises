const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, responce) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.hashPassword);

  if (!(user && passCorrect)) {
    return responce.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 },
  );

  return responce
    .status(200)
    .json({
      token,
      username: user.username,
      name: user.name,
      id: user.id,
    });
});

module.exports = loginRouter;

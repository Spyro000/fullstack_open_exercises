const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.get('/', async (request, responce) => {
  const users = await User.find({});
  responce.json(users);
});

userRouter.post('/', async (request, responce) => {
  const { username, name, password } = request.body;

  if (!password) {
    responce.status(404).json({ error: 'missing password' });
    return;
  }

  const sameUser = await User.findOne({ username });
  if (sameUser) {
    responce.status(404).json({ error: `${username} already exists` });
    return;
  }

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    hashPassword,
  });
  const createdUser = await newUser.save();
  responce.status(201).json(createdUser);
});

module.exports = userRouter;

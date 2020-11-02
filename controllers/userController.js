const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const utils = require('../utils/utils');
const User = require('../models/User');

//USER SIGNUP
exports.signupUser = async (req, res, next) => {
  try {
    let { password } = req.body;
    const { name, email, avatar } = req.body;
    password = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      avatar,
      password
    });
    res.status(201).send(user);
  } catch (error) {
    utils.errorFunc(error, res);
  }
};

//USER SIGNIN
exports.signinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: { msg: "Invalid credentials" } });
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) return res.status(400).send({ error: { msg: "Invalid credentials" } });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ user, jwt: token });
  } catch (error) {
    utils.errorFunc(error, res);
  }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const utils = require('../utils/utils');
const sendEmail = require('../utils/sendEmail');
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, jwt: token });
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

//USER RESET PASSWORD
exports.resetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).send({ error: { msg: "Invalid user" } });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    sendEmail(email, 'Reset Password', `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Forgot Password </title>
        <style>
            a:link, a:visited {
                background-color: blue;
                color: white;
                padding: 14px 25px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                border-radius: 2px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
    <h1>Forgot Password, No Worries! </h1>
    You recently requested to reset your password for Chat-App account. <br/>
    Click the link Below to Reset password <br/><br/>
    <a href="http://localhost:3000/forgotPassword/${token}"> Click Here to Reset Password </a><br/><br/>
    If you did not request a password reset , please ignore this email
    or reply to let us know.
    <br/>
    <h4>Regards ,<br/>
        Chat-App Team </h4>
    </body>
    </html>  
    `);
    res.send({ message: "Check your email." });
  } catch (error) {
    utils.errorFunc(error, res);
  }
};

//PASSWORD RESET
exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    if (!password) return res.status(400).send({ error: { msg: "Enter password." } });
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId.userId);
    if(!user) return res.status(400).send({ error: { msg: "Invalid user" } });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    utils.errorFunc(error, res);
  }
};
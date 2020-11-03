const express = require('express');
const { body } = require('express-validator');

const utils = require('../utils/utils');
const userController = require('../controllers/userController');

const route = new express.Router();

//SIGNUP USER
route.post('/user/signup', utils.validate([
  body('name').isAlpha(),
  body('email').isEmail(),
  body('avatar').optional({ nullable: true }).isURL()
]), userController.signupUser);

//SIGNIN USER
route.post('/user/signin', utils.validate([
  body('email').isEmail()
]), userController.signinUser);

//RESETPASSWORDEMAIL
route.post('/reset-password', utils.validate([
  body('email').isEmail()
]), userController.resetPasswordEmail);

//RESETPASSWORD
route.post('/reset-password/:token', userController.resetPassword);

module.exports = route;
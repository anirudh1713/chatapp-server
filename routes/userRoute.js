const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

const utils = require('../utils/utils');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

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

//RESET PASSWORD EMAIL
route.post('/reset-password', utils.validate([
  body('email').isEmail()
]), userController.resetPasswordEmail);

//RESET PASSWORD
route.post('/reset-password/:token', userController.resetPassword);

//UPLOAD FILE MULTER
function uploadFile(req, res, next) {
  const upload = multer({
    limits: {
      fileSize: 1 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
      if(!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
        cb('upload image only.', false);
      }
      cb(undefined, true);
    }
  }).single('profileImage');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({error: { msg: err }});
    } else if (err) {
      return res.status(400).send({ error: { msg: err } });
    }
    next();
  })
};
//EDIT PROFILE ROUTE
route.post('/user/profile', auth, uploadFile, utils.validate([
  body('email').isEmail(),
  body('avatar').optional({ nullable: true }).isURL(),
  body('name').isAlpha()
]), userController.editProfile);

module.exports = route;
const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const utils = require('../utils/utils');

const auth = async (req, res, next) => {
  try {
    if(!req.headers.authorization) return res.status(401).send({ erorr: { msg: "Not authorized." } });
    const token = req.headers.authorization.split(' ')[1];
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payLoad.userId);
    if(!user) return res.status(401).send({ error: { msg: "Not authorized." } });
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    utils.errorFunc(error, res);
  }
};

module.exports = auth;
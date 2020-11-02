const { validationResult } = require('express-validator');

exports.isRequiredMessage = (field) => {
  return `${field} is required.`;
};

//ERROR FUNC FOR CONTROLLERS
exports.errorFunc = (error, res) => {
  console.log(error);
  res.status(500).send({ error: { msg: error.message } });
};

//VALIDATION FUNCTION FOR ROUTES
exports.validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).send({ error: errors.array()[0] });
  };
};
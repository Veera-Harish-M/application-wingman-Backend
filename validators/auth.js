const { check } = require("express-validator/check");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 characters"),
];

exports.SocialSignupValidator = [
  check("name").not().isEmpty().withMessage("name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
];

exports.userSigninValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least  8 characters long"),
];

exports.SocialSigninValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
];

exports.forgetPasswordValidator = [
  check("email")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least  8 characters long"),
];
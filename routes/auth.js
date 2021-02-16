const express = require('express');
const { signup, accountActivation, signin, signout, forgotPassword, resetPassword } = require('../controllers/auth');

const router = express.Router();
const { socialsignup, socialsignin } = require("../controllers/socialAuth")

//import validators
const { userSignupValidator, SocialSignupValidator, userSigninValidator, SocialSigninValidator, forgetPasswordValidator, resetPasswordValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/socialsignup', SocialSignupValidator, runValidation, socialsignup);
router.post('/socialsignin', SocialSigninValidator, runValidation, socialsignin);

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/account-activation', accountActivation);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

//forget reset password
router.put('/forget-password', forgetPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

module.exports = router;
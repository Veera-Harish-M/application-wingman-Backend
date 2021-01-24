const express_validate = require("express-validator")

exports.signInValidator =[
    express_validate.check("name").not().isEmpty().withMessage("name required"),
    express_validate.check("email").not().isEmpty().isEmail().withMessage("Invalid Email")
];

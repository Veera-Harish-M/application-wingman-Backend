const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.verifyuser = async (req, res, next) => {
  try {
    var token = req.header("Authorization");
    if (!token)
      return res.status(401).send({
        status: "Error",
        message: "Access Denied",
      });
    token = token.replace("Bearer ", "");

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const userdetails = await User.findOne({ _id: verified._id });
    req.user = userdetails;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

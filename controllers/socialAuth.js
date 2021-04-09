const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.socialsignup = (req, res) => {
  try {
    const { name, email, profilepic, expiry } = req.body;
    const accessToken = req.header("Authorization").replace("Bearer ", "");

    if (!accessToken)
      return res
        .status(200)
        .json({ status: "Error", message: "invalid access Token" });

    console.log(new Date().toISOString());
    if (new Date(expiry).toISOString() > new Date().toISOString())
      return res
        .status(200)
        .json({ status: "Error", message: "Token Expired" });

    User.findOne({ email }).exec((err, user) => {
      if (err)
        return res
          .status(200)
          .json({ status: "Error", message: "Something Went Wrong" });
      if (user) {
        return res.status(400).json({
          status: "Error",
          message: "Email is taken",
        });
      }

      const userData = new User({ name, email, profilepic });

      userData.save(async (err, userData) => {
        if (err) {
          return res.status(401).json({
            status: "Error",
            message: "Error saving user in database. Try signup again",
          });
        }

        const token = jwt.sign({ _id: userData._id }, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(userData._id, { token: token });

        return res.json({
          userData,
          token,
          status: "Success",
          message: "Signup success. Please signin.",
        });
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

exports.socialsignin = (req, res) => {
  try {
    const { email, expiry } = req.body;
    const accessToken = req.header("Authorization").replace("Bearer ", "");

    if (!accessToken)
      return res
        .status(200)
        .json({ status: "Error", message: "invalid access Token" });

    if (new Date(expiry).toISOString() > new Date().toISOString())
      return res
        .status(200)
        .json({ status: "Error", message: "Token Expired" });

    // check if user exist
    User.findOne({ email }).exec((err, user) => {
      console.log("hello");
      if (err || !user) {
        return res.status(400).json({
          status: "Error",
          message: "User with that email does not exist. Please signup",
        });
      }

      // generate a token and send to client
      //const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const { _id, name, email, profilepic, token } = user;
      res.cookie("t", token, { expire: new Date() + 9999 });

      return res.json({
        token: token,
        status: "Success",
        message: "SignIn Success",
        userData: { _id, name, email, profilepic},
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

const User = require("../models/user");
const jwt = require("jsonwebtoken");

const expressJwt = require("express-jwt");
const _ = require("lodash");

//sendgrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// User SignUp
exports.signup = (req, res) => {
  try {
    const { name, email, password, profilepic } = req.body;
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

      const token = jwt.sign(
        { name, email, password, profilepic },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "10m" }
      );

      console.log(token);
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activation/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      };

      sgMail
        .send(emailData)
        .then((sent) => {
          console.log("SIGNUP EMAIL SENT", sent);
          return res.json({
            status: "Success",
            message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
          });
        })
        .catch((err) => {
          console.log("SIGNUP EMAIL SENT ERROR", err);
          return res.json({
            status: "Error",
            message: "SIGNUP EMAIL SENT ERROR",
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

exports.accountActivation = async (req, res) => {
  try {
    const ActivationToken = req.header("Authorization").replace("Bearer ", "");
    if (ActivationToken) {
      jwt.verify(ActivationToken, process.env.JWT_ACCOUNT_ACTIVATION, function (
        err,
        decoded
      ) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            status: "Error",
            message: "Expired link. Signup again",
          });
        }

        const { name, email, password, profilepic } = jwt.decode(
          ActivationToken
        );

        const user = new User({
          name,
          email,
          password,
          profilepic,
        });

        user.save(async (err, resuser) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              status: "Error",
              message: "Error saving user in database. Try signup again",
            });
          }

          const token = jwt.sign({ _id: resuser._id }, process.env.JWT_SECRET);

          console.log(resuser._id, token);
          await User.findByIdAndUpdate(resuser._id, { token: token });
          return res.json({
            status: "Success",
            message: "Signup success. Please signin.",
          });
        });
      });
    } else {
      return res.json({
        status: "Error",
        message: "Something went wrong. Try again.",
      });
    }
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

// SignIn Function
exports.signin = (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exist

    User.findOne({ email }).exec((err, user) => {
      console.log("hello");
      if (err || !user) {
        return res.status(400).json({
          status: "Error",
          message: "User with that email does not exist. Please signup",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          status: "Error",
          message: "Email and password do not match",
        });
      }
      // generate a token and send to client
      // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const { _id, name, email, profilepic, token } = user;
      res.cookie("t", token, { expire: new Date() + 9999 });
      console.log(token);

      return res.json({
        status: "Success",
        message: "Signup success",
        token,
        userData: { _id, name, email, profilepic },
      });
    });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

// SignOut Function
exports.signout = (req, res) => {
  try {
    res.clearCookie("t");
    res.json({ status: "Success", message: "signout Success" });
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

// RequireSignIn MiddleWare
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});


// Forget password
exports.forgotPassword = (req, res) => {
  try {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: "Error",
          message: "User with that email does not exist",
        });
      }

      const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: "10m",
        }
      );

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password Reset link`,
        html: `
                <img style="width:40px;" src="https://www.clipartkey.com/mpngs/m/261-2614108_transparent-bird-wing-png-wing-tattoo-png.png" alt="AppWingman"/>
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      };

      return user.updateOne({ resetPasswordLink: token }, (err, success) => {
        if (err) {
          console.log("RESET PASSWORD LINK ERROR", err);
          return res.status(400).json({
            status: "Error",
            message:
              "Database connection error on user password forgot request",
          });
        } else {
          sgMail
            .send(emailData)
            .then((sent) => {
              // console.log('SIGNUP EMAIL SENT', sent)
              return res.json({
                status: "Success",
                message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
              });
            })
            .catch((err) => {
              console.log('SIGNUP EMAIL SENT ERROR', err)
              console.error(err.response.body)
              return res.json({
                status: "Error",
                message: "Something went wrong",
              });
            });
        }
      });
    });
  } catch (err) {
    console.log("fds");
    console.log(err);
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

// Reset Password
exports.resetPassword = (req, res) => {
  try {
    const resetPasswordLink = req
      .header("Authorization")
      .replace("Bearer ", "");

    const { newPassword } = req.body;

    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
        err,
        decoded
      ) {
        if (err) {
          return res.status(400).json({
            status: "Error",
            message: "Expired link. Try again",
          });
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              status: "Error",
              message: "Something went wrong. Try later",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                status: "Error",
                message: "Error resetting user password",
              });
            }
            res.json({
              status: "Success",
              message: `Great! Now you can login with your new password`,
            });
          });
        });
      });
    }
  } catch (err) {
    res.status(400).send({
      status: "Error",
      message: "Something Went Wrong",
    });
  }
};

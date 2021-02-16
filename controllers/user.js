const User = require("../models/user");

// User userdetails
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not Found",
      });
    }
    req.userdetails = user;
    console.log(user);
    next();
  });
};

exports.read = (req, res) => {
  req.userdetails.hashed_password = undefined;
  req.userdetails.salt = undefined;
  return res.json(req.userdetails);
};

exports.update = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password } = req.body;

  User.findOne({ _id: req.userdetails._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    if (!name) {
      return res.status(400).json({
        error: 'Name is required'
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password should be min 6 characters long'
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed'
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};


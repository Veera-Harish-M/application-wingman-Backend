const User = require("../modals/user")

exports.signIn =(req,res)=>{
    try{
        User.findOne({ email }).exec((err, user) => {
            
            if (err || !user) {
              return res.status(400).json({
                status: "Error",
                message: "User with that email does not exist. Please signup",
              });
            }
            
            // authenticate
            if (!user.validatePassword(password)) {
              return res.status(400).json({
                status: "Error",
                message: "Email and password do not match",
              });
            }
            
            // generate a token and send to client
            // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const { _id, name, email, profilepic, role, token } = user;
            res.cookie("t", token, { expire: new Date() + 9999 });
            console.log(token);
      
            return res.json({
              status: "Success",
              message: "Signup success",
              token,
              userData: { _id, name, email, profilepic, role },
            });
          });
        } catch (err) {
          res.status(400).send({
            status: "Error",
            message: "Something Went Wrong",
          });
        }
}
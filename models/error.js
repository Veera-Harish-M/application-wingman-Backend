const mongoose = require("mongoose");

//error schema model
const errorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    solution: {
      type: String,
    },
    category:{
      type:String,
    },
    language:{
      type:String,
    },
  }
);

module.exports = mongoose.model("Error", errorSchema);
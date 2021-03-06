const mongoose = require("mongoose");

//algo schema model
const algoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    code: {
      type: String,
    },
    category:{
      type:String,
    },
    timecomplexity: {
        type: String,
      },
    spacecomplexity: {
        type: String,
      },
    usage: {
        type: String,
    },
    language:{
      type:String,
    },
  }
);

module.exports = mongoose.model("Algo", algoSchema);
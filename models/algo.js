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
    timecomplexity: {
        type: String,
      },
    spacecomplexity: {
        type: String,
      },
    usage: {
        type: String,
      },
  }
);

module.exports = mongoose.model("Algo", algoSchema);
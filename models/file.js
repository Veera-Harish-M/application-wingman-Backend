const mongoose = require("mongoose");

//error schema model
const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Files", fileSchema);

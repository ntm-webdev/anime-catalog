const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  watchList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Anime",
    },
  ],
  feedback: [
    {
      type: Schema.Types.ObjectId,
      ref: "Anime",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

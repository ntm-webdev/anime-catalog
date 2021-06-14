const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const animeSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  release_date: {
    type: Date,
    required: true,
  },
  episodes: {
    type: Number,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
  },
  usersWannaWatch: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  feedback: [
    {
      userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Anime", animeSchema);

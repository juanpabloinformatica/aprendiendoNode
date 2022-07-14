const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const urlSchema = new Schema({
  origin: {
    type: String,
    require: true,
    unique: true,
  },
  shortUrl: {
    type: String,
    require: true,
    unique: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Url = mongoose.model("url", urlSchema);
module.exports = Url;

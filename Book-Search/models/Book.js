const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  authors: {
    type: Array,
    required: true,
  },
  description: { type: String },
  image: { type: String },
  link: { type: String },
});

const Book = new mongoose.model("Book", BookSchema);

module.exports = Book;
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  // foreign key
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);

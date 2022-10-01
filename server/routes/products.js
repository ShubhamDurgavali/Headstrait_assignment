const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Product = require("../models/Product");
const { body, validationResult } = require("express-validator");

// ROUTE 1: get all the products using: GET "/api/product/fetchallproducts"  login required

router.get("/fetchallproducts", fetchUser, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    // Catch errors
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Add a new product using: POST "/api/product/addproduct" login required

router.post(
  "/addproduct",
  fetchUser,
  [
    body("productName", "Enter a valid product name").isLength({ min: 5 }),
    body(
      "productDescription",
      "Description must be atleast 8 characters"
    ).isLength({
      min: 8,
    }),
    body("productCategory", "Enter a valid product category"),
    body("productImage", "Enter a valid image url"),
    body("productPrice", "Enter price").isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const {
        productName,
        productDescription,
        productCategory,
        productImage,
        productPrice,
      } = req.body;
      // If there are errors, return bad request and the errors

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const product = new Product({
        productName,
        productDescription,
        productCategory,
        productImage,
        productPrice,
        user: req.user.id,
      });
      const savedProduct = await product.save();

      res.json(savedProduct);
    } catch (error) {
      // Catch errors
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Update an existing product using: PUT "/api/auth/updateproduct" login required
router.put("/updateproduct/:id", fetchUser, async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productCategory,
      productImage,
      productPrice,
    } = req.body;

    //Create a new product object
    const newProduct = {};
    if (productName) {
      newProduct.productName = productName;
    }
    if (productDescription) {
      newProduct.productDescription = productDescription;
    }
    if (productCategory) {
      newProduct.productCategory = productCategory;
    }
    if (productImage) {
      newProduct.productImage = productImage;
    }
    if (productPrice) {
      newProduct.productPrice = productPrice;
    }

    //   Find the product to be updated and update it
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Not found");
    }
    if (product.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: newProduct },
      { new: true }
    );
    res.json({ product });
  } catch (error) {
    // Catch errors
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: Delete an existing product using: DELETE "/api/auth/deleteproduct" login required
router.delete("/deleteproduct/:id", fetchUser, async (req, res) => {
  try {
    //   Find the product to be deleted and delete it
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Not found");
    }

    // Allow deleletion only if user owns this product
    if (product.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    product = await Product.findByIdAndDelete(req.params.id);
    res.json({ success: "product has been deleted", product: product });
  } catch (error) {
    // Catch errors
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

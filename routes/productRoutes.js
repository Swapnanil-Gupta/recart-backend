const express = require("express");
const upload = require("../configs/multer");
const productController = require("../controllers/productController");
const productValidator = require("../validators/productValidators");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get(
  "/:id",
  productValidator.getProductByIdValidator(),
  productController.getProductById
);
router.post(
  "/",
  upload.single("image"),
  productValidator.createProductValidator(),
  productController.createProduct
);

module.exports = router;

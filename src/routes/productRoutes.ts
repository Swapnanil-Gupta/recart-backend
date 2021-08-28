import { Router } from "express";
import upload from "../configs/multer";
import productController from "../controllers/productController";
import productValidator from "../validators/productValidators";

const router = Router();

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

export default router;

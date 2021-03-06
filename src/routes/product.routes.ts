import { Router } from "express";
import upload from "../configs/multer";
import productController from "../controllers/product.controller";
import productValidator from "../validators/product.validator";
import validationMiddleware from "../middlewares/validation.middleware";
import errorMessages from "../error/errorMessages";
import auth from "../middlewares/auth.middleware";
import roles from "../configs/roles";
import uploadToCloudinaryMiddleware from "../middlewares/cloudinary.middleware";

const router = Router();

// TODO: Add validator for query params
router.get("/", productController.getAllProducts);
router.get(
  "/:id",
  productValidator.getProductByIdValidator(),
  validationMiddleware(errorMessages.product.getProductById),
  productController.getProductById
);
router.post(
  "/",
  upload.single("image"),
  auth([roles.admin]),
  productValidator.createProductValidator(),
  validationMiddleware(errorMessages.product.createProduct),
  uploadToCloudinaryMiddleware(errorMessages.product.createProduct),
  productController.createProduct
);

export default router;

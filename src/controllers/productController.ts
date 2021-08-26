import { Request, Response, NextFunction } from "express";
import ApiError from "../error/ApiError";
import Product from "../models/Product";
import cloudinary from "../configs/cloudinary";
import { validationResult } from "express-validator";

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    const errMsg = "Unable to create new product";
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }

    if (!req.file) {
      return next(ApiError.badRequest(errMsg, ["Product image is required"]));
    }

    let imageUrl = null;
    try {
      const cloudinaryResp = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "recart",
      });
      imageUrl = cloudinaryResp.secure_url;
      console.log("Product image uploaded successfully to cloudinary");
    } catch (err) {
      console.error(err);
      return next(
        ApiError.internal(errMsg, [
          "Unable to upload image to cloudinary. Create product terminated",
        ])
      );
    }

    const { name, description, price, countInStock } = req.body;

    try {
      const newProduct = new Product({
        name,
        description,
        price,
        countInStock,
        imageUrl,
      });
      await newProduct.save();
      res.status(201).send(newProduct);
    } catch (err) {
      next(ApiError.internal(errMsg, [err.message]));
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    const errMsg = "Unable to fetch product by id";
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }

    const productId = req.params.id;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return next(
          ApiError.notFound(`Product with id ${productId} not found`)
        );
      }
      res.send(product);
    } catch (err) {
      next(ApiError.internal(errMsg, [err.message]));
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 20;

    try {
      const total = await Product.countDocuments();
      const allProducts = await Product.find()
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.send({
        total,
        results: allProducts,
      });
    } catch (err) {
      next(ApiError.internal("Unable to fetch all products", [err.message]));
    }
  }
}

export default new ProductController();

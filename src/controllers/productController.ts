import { Request, Response, NextFunction } from "express";
import ApiError from "../error/ApiError";
import Product from "../models/Product";
import cloudinary from "../configs/cloudinary";
import { validationResult } from "express-validator";
import logger from "../configs/logger";

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    const errMsg = "Unable to create new product";

    logger.info("checking for validation errors");
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      logger.error("validation error occured");
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }
    logger.info("no validation errors. Proceeding..");

    if (!req.file) {
      logger.error("req.file is not present");
      return next(ApiError.badRequest(errMsg, ["Product image is required"]));
    }

    let imageUrl = null;
    try {
      logger.info("starting cloudinary image upload");
      const cloudinaryResp = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "recart",
      });
      imageUrl = cloudinaryResp.secure_url;
      logger.info("product image uploaded successfully to cloudinary");
    } catch (err) {
      logger.error("unable to upload image to cloudinary => %O", err);
      return next(
        ApiError.internal(errMsg, [
          "Unable to upload image to cloudinary. Create product terminated",
        ])
      );
    }

    const { name, description, price, countInStock } = req.body;

    try {
      logger.info("saving new product");
      const newProduct = new Product({
        name,
        description,
        price,
        countInStock,
        imageUrl,
      });
      await newProduct.save();
      logger.info("product saved successfully");
      res.status(201).send(newProduct);
    } catch (err) {
      logger.error("unable to save new product => %O", err);
      next(ApiError.internal(errMsg, [err.message]));
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    const errMsg = "Unable to fetch product by id";

    logger.info("checking for validation errors");
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      logger.error("validation error occured");
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }
    logger.info("no validation errors. Proceeding..");

    const productId = req.params.id;
    try {
      logger.info(`fetching product with id ${productId}`);
      const product = await Product.findById(productId);
      if (!product) {
        logger.error("product not found");
        return next(
          ApiError.notFound(`Product with id ${productId} not found`)
        );
      }
      logger.info("product found");
      res.send(product);
    } catch (err) {
      logger.error(`unable to find product by id ${productId} => %O`, err);
      next(ApiError.internal(errMsg, [err.message]));
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 20;

    try {
      logger.info("fetching all products and product count");
      const total = await Product.countDocuments();
      const allProducts = await Product.find()
        .skip((page - 1) * perPage)
        .limit(perPage);

      logger.info("fetched successfully");
      res.send({
        total,
        results: allProducts,
      });
    } catch (err) {
      logger.error("unable to get all products => %O", err);
      next(ApiError.internal("Unable to fetch all products", [err.message]));
    }
  }
}

export default new ProductController();

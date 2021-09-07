import { Request, Response, NextFunction } from "express";
import ApiError from "../error/ApiError";
import Product from "../models/Product";

import logger from "../configs/logger";
import errorMessages from "../error/errorMessages";

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    const errMsg = errorMessages.product.createProduct;

    const { name, description, price, countInStock } = req.body;
    const imageUrl = (req as Request & { uploadedImageUrl: string })
      .uploadedImageUrl;

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
    const errMsg = errorMessages.product.getProductById;

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
      const products = await Product.find()
        .skip((page - 1) * perPage)
        .limit(perPage);
      logger.info("fetched successfully");

      res.send({
        total,
        page,
        perPage,
        results: products,
      });
    } catch (err) {
      logger.error("unable to get all products => %O", err);
      next(ApiError.internal("Unable to fetch all products", [err.message]));
    }
  }
}

export default new ProductController();

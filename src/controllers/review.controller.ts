import { Request, Response, NextFunction } from "express";
import ApiError from "../error/ApiError";
import ProductReview from "../models/ProductReview";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import logger from "../configs/logger";
import errorMessages from "../error/errorMessages";

class ReviewController {
  async getReviewsByProductId(req: Request, res: Response, next: NextFunction) {
    const errMsg = errorMessages.review.getReviewsByProductId;

    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 10;
    const productId = req.params.productId;

    // TODO: Add query param for sorting

    logger.info(`fetching all reviews for product id ${productId}`);
    try {
      const total = await ProductReview.countDocuments({ productId });
      const reviews = await ProductReview.find({ productId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
      logger.info("fetched successfully");

      res.send({
        total,
        page,
        perPage,
        results: reviews,
      });
    } catch (err) {
      logger.error(
        `unable to get reviews for product id ${productId} =? %O`,
        err
      );
      next(ApiError.internal(errMsg, [err.message]));
    }
  }

  async getReviewAggregateByProductId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errMsg = errorMessages.review.getReviewAggregateByProductId;

    const productId = req.params.productId;

    // TODO: Remove average rating aggregate because it can be calculated at the frontend

    try {
      logger.info(`fetching average rating for product id ${productId}`);
      const averageRating = await ProductReview.aggregate([
        { $match: { productId: mongoose.Types.ObjectId(productId) } },
        { $project: { _id: 0, productId: 1, rating: 1 } },
        { $group: { _id: "$productId", averageRating: { $avg: "$rating" } } },
        { $project: { _id: 0 } },
      ]);
      logger.info("successfully fetched average rating");

      logger.info(`fetching rating aggregate for product id ${productId}`);
      const ratingAggregate = await ProductReview.aggregate([
        { $match: { productId: mongoose.Types.ObjectId(productId) } },
        { $project: { _id: 0, rating: 1 } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $project: { _id: 0, rating: "$_id", count: 1 } },
      ]);
      logger.info("successfully fetched rating aggregate");

      logger.info("averageRating => %O", averageRating);
      logger.info("ratingAggregate => %O", ratingAggregate);

      res.send({
        averageRating: averageRating[0]?.averageRating || 0,
        ratingAggregate,
      });
    } catch (err) {
      logger.info("unable to fetch average rating/aggregate => %O", err);
      next(ApiError.internal(errMsg, [err.message]));
    }
  }

  async createReviewForProductId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errMsg = errorMessages.review.createReviewForProductId;

    const productId = req.params.productId;
    const userId = (req as Request & { user: any }).user._id;
    const { review, rating } = req.body;

    try {
      logger.info(`saving new review for product id ${productId}`);
      const newReview = new ProductReview({
        productId,
        userId,
        review,
        rating,
      });
      await newReview.save();
      logger.info("successfully saved");
      res.status(201).send(newReview);
    } catch (err) {
      logger.error("unable to save review => %O", err);
      next(ApiError.internal(errMsg, [err.message]));
    }
  }
}

export default new ReviewController();

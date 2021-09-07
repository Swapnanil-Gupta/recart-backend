const erroMessages = {
  product: {
    createProduct: "Unable to create new product",
    getProductById: "Unable to fetch product by id",
  },
  user: {
    createUser: "Unable to create new user",
    authenticate: "Unable to sign in user",
    refreshToken: "Unable to refresh token",
  },
  review: {
    getReviewsByProductId: "Unable to fetch reviews",
    getReviewAggregateByProductId: "Unable to fetch aggregate",
    createReviewForProductId: "Unable to create review",
  },
  admin: {
    createAdmin: "Unable to create new admin",
  },
};

export default erroMessages;

import app from "./app";
import logger from "./configs/logger";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  logger.info(
    `------------------Listening for requests on port ${port}--------------------`
  );
});

import multer from "multer";

/*
  AWS Lambda doesnt allow file/folder write options.
  So keep it in memory by not providing options.
*/
const upload = multer();

export default upload;

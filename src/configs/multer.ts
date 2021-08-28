import multer from "multer";

const upload = multer({
  dest: "temp-uploads",
});

export default upload;

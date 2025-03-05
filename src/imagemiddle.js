const multer = require("multer");
const uuid = require("uuid");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
// const fileupload = multer({
//     limits: 10000000,
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, './uploads/biopics');
//         },
//         filename: (req, file, cb) => {
//             const ext = MIME_TYPE_MAP[file.mimetype];
//             cb(null, uuid.v1() + '.' + ext);
//         }
//     }),
//     fileFilter : (req, file, cb) => {
//         const isValid = !!MIME_TYPE_MAP[file.mimetype];
//         let error = isValid ? null : new Error('Invalid mime type!');
//         cb(error, isValid);
//     }
// });

const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload.single("photo");

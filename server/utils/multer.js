const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|csv/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (mimetype && extname) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only .jpeg, .jpg, and .png formats are allowed!'));
//     }
// };
// const fileFilter = (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|csv|json|xlsx|xls/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (mimetype && extname) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only .jpeg, .jpg, .png, .csv, .json, .xlsx, and .xls formats are allowed!'));
//     }
// };



const fileFilter = (req, file, cb) => {
  const imageExtensions = ['.jpeg', '.jpg', '.png'];
  const excelExtensions = ['.csv', '.xls', '.xlsx'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isImage = imageExtensions.includes(ext);
  const isExcel = excelExtensions.includes(ext);

  // Determine allowed types based on field name
  switch (file.fieldname) {
    case 'avatar':
    case 'blogImage':
    case 'feedbackImage':
      if (isImage) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpeg, .jpg, and .png formats are allowed for images!'));
      }
      break;
    case 'file':
      if (isExcel) {
        cb(null, true);
      } else {
        cb(new Error('Only .csv, .xls, and .xlsx formats are allowed for file uploads!'));
      }
      break;
    case 'faqMedia':
      const allowedExt = ['.jpeg', '.jpg', '.png', '.mp4', '.mov', '.avi', '.mkv'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedExt.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Only image or video files are allowed for faqMedia!'));
      }
      break;

    default:
      cb(new Error('Invalid field name for file upload.'));
  }
};


// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).fields([
  { name: 'avatar', maxCount: 1 }, // Single file upload for avatar
  { name: 'file', maxCount: 1 },
  { name: 'blogImage', maxCount: 1 },
  { name: 'feedbackImage', maxCount: 5 },
  { name: 'faqMedia', maxCount: 10 }
]);

module.exports = {
  upload
};

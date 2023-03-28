
var multer=require('multer')


//uploads product img
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/Product-imgges");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  const uploadMultiple = multer({ storage: multerStorage }).fields([{ name: 'Image', maxCount: 1 }, { name: 'Image2', maxCount: 1 }, { name: 'Image3', maxCount: 1 }])

  module.exports={

    uploadMultiple
  }
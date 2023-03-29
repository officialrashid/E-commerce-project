const multer = require("multer")
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file,"?????????///////////////////");
      cb(null, "./public/Product-images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const uploadMultiple = multer({ storage: multerStorage }).fields([{ name: 'Image1', maxCount: 1 },{ name: 'Image2', maxCount: 1 },{ name: 'Image3', maxCount: 1 },{ name: 'Image4', maxCount: 1 }])


  module.exports={uploadMultiple}
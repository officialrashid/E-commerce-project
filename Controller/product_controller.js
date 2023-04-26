const { respons, response } = require('express');
const { getAllProduct, getAllCategoryDropdown, adminAdd, getCategory, adminEdit, adminEditSubmit, productListAndUnlist, insertProductOffer, getProductOffer, productAllDetails, getAllProductOffer } = require('../Model/product-helpers');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, './public/Product-images')
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg')
  }

})
const upload = multer({ storage: storage })

module.exports = {

  sessionCheck: (req, res, next) => {
    try {
      if (req.session.users) {
        next();
      } else {
        res.redirect('/loginAndSignupButton')
      }
    } catch (error) {
      next(error);
    }
  },
  loginredirect: (req, res, next) => {
    try {
      if (!req.session.users) {
        req.session.loggedIn = false
      } if (req.session.users) {
        res.redirect('/')
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  nocache: (req, res, next) => {
    try {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    } catch (error) {
      next(error);
    }
  },
  verifyLogin: (req, res, next) => {
    try {
      if (req.session.users) {
        next()
      } else {
        res.redirect('/loginAndSignupButton')
      }
    } catch (error) {
      next(error);
    }
  },
  stocks(req, res, next) {
    try {
      getAllProduct().then((products) => {
        res.render('adminviews/adminStocks', { user: false, products })
      })
    } catch (error) {
      next(error);
    }
  },
  addProduct(req, res, next) {
    try {
      getAllCategoryDropdown().then((getcategorydropdown) => {
        res.render('adminviews/AddProduct', { user: false, getcategorydropdown })
      })
    } catch (error) {
      next(error);
    }
  },
  addedProduct(req, res, next) {
    try {
      const files = req.files
      console.log(files);
      const fileName = files.map((file) => {
        return file.filename
      })
      let data = req.body
      data.productImage = fileName
      adminAdd(req.body).then((data) => {
        res.redirect('/product/stocks')
      })
    } catch (error) {
      next(error);
    }
  },
  editProduct(req, res) {
    try {
      let productid = req.params.id
      getCategory().then((geteditcategory) => {
        adminEdit(productid).then((product) => {
          res.render('adminviews/EditProduct', { user: false, product, geteditcategory })
        })
      })
    } catch (error) {
      next(error);
    }
  },
  editSubmit: async (req, res) => {
    try {
      let id = req.params.id
      let data = req.body
      let img = req.files
      console.log(req.file);
      adminEditSubmit(req.params.id, req.body, img).then(() => {
        res.redirect('/product/stocks')
      })
    } catch (error) {
      next(error);
    }
  },
  productManage(req, res) {
    try {
      console.log(req.params.id, req.body.stock);
      productListAndUnlist(req.params.id, req.body.stock).then((response) => {
        res.redirect('/product/stocks')
      })
    } catch (error) {
      next(error);
    }
  },
  productOffer(req, res) {
    try {
      getAllProduct().then((products) => {
        res.render('adminviews/ProductOffers', { user: false, products })
      })
    } catch (error) {
      next(error);
    }
  },
  addProductOffer(req, res) {
    try {
      console.log(req.body);
  
      insertProductOffer(req.body).then(() => {
  
        getProductOffer(req.body).then(() => {
  
          res.redirect('/admin/allOffers')
        })
  
  
      })
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error.");
    }
  },
  
  productDetails(req, res, next) {
    try {
      let users = req.session.users
      productAllDetails(req.params.id).then((DetailProduct) => {
        res.render('userviews/productDetails', { user: true, DetailProduct, users })
      })
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error.");
    }
  }
  


}
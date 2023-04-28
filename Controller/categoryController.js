const { respons, response } = require('express');

const { getAllCategory, addCategorys, adminCategoryEdit, categoryEdit, removeCategory, filterByCategory, getCategory, insertCategoryOffer, makeCategoryOffer } = require('../Model/category-helpers')

module.exports = {

  categoryPage(req, res, next) {
  try {
    getAllCategory().then((getcategory) => {
      res.render('adminviews/adminCategory', { user: false, getcategory });
    });
  } catch (error) {
    next(error);
  }
},

addCategory(req, res, next) {
  try {
    res.redirect('/category/category');
  } catch (error) {
    next(error);
  }
},

addedCategory(req, res) {
  try {
    addCategorys(req.body).then((addcategory) => {
      res.redirect('/category/category');
    }).catch((error) => {
      getAllCategory().then((getcategory) => {
        res.render('adminviews/adminCategory', { error: `${error.error}`, getcategory, user: false });
      });
    });
  } catch (error) {
    next(error);
  }
},

editCategory(req, res, next) {
  try {
    let categoryid = req.params.id;
    adminCategoryEdit(categoryid).then((categoryEdit) => {
      res.render('adminviews/EditCategory', { user: false, categoryEdit });
    });
  } catch (error) {
    next(error);
  }
},

editCategorySubmit(req, res, next) {
  try {
    categoryEdit(req.params.id, req.body).then(() => {
      res.redirect('/category/category');
    });
  } catch (error) {
    next(error);
  }
},

deleteCategory(req, res) {
  try {
    let deleteCategoryid = req.params.id;
    removeCategory(deleteCategoryid).then((response) => {
      res.redirect('/category/category');
    });
  } catch (error) {
    next(error);
  }
},

categoryFilter(req, res) {
  try {
    let users = req.session.user;
    let name = req.body;
    console.log(users);
    console.log(name);
    filterByCategory(name).then((ShowProducts) => {
      getCategory().then((getCategoryData) => {
        res.render('userviews/ShopPage', { user: true, ShowProducts, users, getCategoryData });
      }).catch(() => {
        res.render('userviews/ShopPage', { user: true, ShowProducts, users, getCategoryData });
      });
    });
  } catch (error) {
    next(error);
  }
},

addCategoryOffer(req, res) {
  try {
    console.log(req.body, "}}}}}}}}}}}}}}}}}}]]");
    insertCategoryOffer(req.body).then((catoffer) => {
      makeCategoryOffer(req.body).then(() => {
        res.redirect('/admin/allOffers');
      });
    });
  } catch (error) {
    next(error);
  }
}


}
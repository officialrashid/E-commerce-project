const { doAdminSignup, getAllUsers, removeProduct, userBlock, adminAddBanner, getAllBanners, editBanners, adminBannerEdit, totalSales, todayOrders, thisWeekOrders, thisMonthOrders, thisYearOrders, totalRevenues, todayRevenue, weekRevenue, yearRevenue, monthRevenue, adminDashboardChart, allSalesReport, addCoupons, allCouponDetails, getAllUsersDashboard, getAllProductOffer, getAllCategoryOffer, adminEditCoupon, adminEditedCoupon, adminDeleteCoupon } = require('../Model/admin-helpers')

const { respons, response } = require('express');

const { Result } = require('express-validator');

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = {

  adminSessionCheck: (req, res, next) => {
    try {
      if (req.session.admins) {
        next();
      } else {
        res.redirect('/admin');
      }
    } catch (error) {
      next(error);
    }
  },
  loginRedirect: (req, res, next) => {
    try {
      if (!req.session.admins) {
        req.session.loggedIn = false;
      }
      if (req.session.admins) {
        res.redirect('/dashboard');
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
// adminLogin Session start

  adminLogin(req, res, next) {

    res.render('adminviews/adminlogin');

// adminLogin Session End
  },
  // adminReginstered Session start
  adminRegisterd(req, res, next) {
    try {
      doAdminSignup(req.body).then((adminData) => {
        req.session.loggedIn = true;
        req.session.admins = adminData;
        totalSales().then((TotalSales) => {
          todayOrders().then((TodaySales) => {
            thisWeekOrders().then((WeekSales) => {
              thisMonthOrders().then((MonthSales) => {
                thisYearOrders().then((YearSales) => {
                  totalRevenues().then((TotalRevenue) => {
                    todayRevenue().then((TodayRevenue) => {
                      weekRevenue().then((WeekRevenue) => {
                        yearRevenue().then((YearRevenue) => {
                          monthRevenue().then((MonthRevenue) => {
                            adminDashboardChart().then((data) => {
                              getAllUsersDashboard().then((usersdashboard) => {
                                console.log(TotalSales);
                                console.log(adminData);
                                res.render('adminviews/admindashboard', { user: false, TotalSales, TodaySales, WeekSales, MonthSales, YearSales, TotalRevenue, TodayRevenue, WeekRevenue, YearRevenue, MonthRevenue, data, usersdashboard });
                              }).catch((error) => {
                                console.error(error);
                                res.render('adminviews/adminlogin');
                              });
                            }).catch((error) => {
                              console.error(error);
                              res.render('adminviews/adminlogin');
                            });
                          }).catch((error) => {
                            console.error(error);
                            res.render('adminviews/adminlogin');
                          });
                        }).catch((error) => {
                          console.error(error);
                          res.render('adminviews/adminlogin');
                        });
                      }).catch((error) => {
                        console.error(error);
                        res.render('adminviews/adminlogin');
                      });
                    }).catch((error) => {
                      console.error(error);
                      res.render('adminviews/adminlogin');
                    });
                  }).catch((error) => {
                    console.error(error);
                    res.render('adminviews/adminlogin');
                  });
                }).catch((error) => {
                  console.error(error);
                  res.render('adminviews/adminlogin');
                });
              }).catch((error) => {
                console.error(error);
                res.render('adminviews/adminlogin');
              });
            }).catch((error) => {
              console.error(error);
              res.render('adminviews/adminlogin');
            });
          }).catch((error) => {
            console.error(error);
            res.render('adminviews/adminlogin');
          });
        }).catch((error) => {
          console.error(error);
          res.render('adminviews/adminlogin');
        });
      }).catch((error) => {
        console.error(error);
        res.render('adminviews/adminlogin');
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
  // adminRegistered Session End

  // getAll users function
  allUsers(req, res, next) {
    try {
      getAllUsers().then((users) => {
        res.render('adminviews/adminAllUsers', { users, user: false });
      });
    } catch (error) {
      console.log(error);
      res.render('adminviews/errorPage', { errorMessage: 'Error fetching all users' });
    }
  },
// getAll users function End

// delte product function
  deleteProduct(req, res) {
    try {
      let deleteid = req.params.id;
      removeProduct(deleteid).then((response) => {
        res.redirect('/product/stocks');
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error deleting product');
    }
  },
// delte product function End

// userBlock function start
  blockManagement(req, res) {
    try {
      userBlock(req.params.id, req.body.status).then(() => {
        res.redirect('/admin/allUsers');
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error blocking/unblocking user');
    }
  },
// userBlock function End///

// adminDashboard all functions  start///
  dashboard(req, res) {

    try {
      totalSales().then((TotalSales) => {

        todayOrders().then((TodaySales) => {

          thisWeekOrders().then((WeekSales) => {

            thisMonthOrders().then((MonthSales) => {

              thisYearOrders().then((YearSales) => {

                totalRevenues().then((TotalRevenue) => {

                  todayRevenue().then((TodayRevenue) => {

                    weekRevenue().then((WeekRevenue) => {

                      yearRevenue().then((YearRevenue) => {

                        monthRevenue().then((MonthRevenue) => {

                          adminDashboardChart().then((data) => {

                            getAllUsersDashboard().then((usersdashboard) => {

                              console.log(TotalSales);

                              res.render('adminviews/admindashboard', { user: false, TotalSales, TodaySales, WeekSales, MonthSales, YearSales, TotalRevenue, TodayRevenue, WeekRevenue, YearRevenue, MonthRevenue, data, usersdashboard })
                            })


                          }).catch((error) => {

                            console.log(error);
                            res.status(500).send('Internal Server Error');
                          })
                        })




                      })

                    })




                  })



                })




              })

            })


          })

        })

      })
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }

  },
// adminDashboard all functions End

// adminAdd banner session
  addBanner(req, res) {
    let users = req.session.users;
    try {
      getAllBanners().then((Banners) => {
        res.render('adminviews/AddBanner', { user: false, users, Banners });
      });
    } catch (error) {
      console.log(error);
      res.render('adminviews/AddBanner', { user: false, users, Banners: [] });
    }
  },

  addedBanner(req, res) {
    try {
      var image = req.files.Image;
      console.log(req.body, "++++++++++++++++++++++++++++");
      console.log(req.files, "}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");

      adminAddBanner(req.body).then((data) => {
        image.mv('./public/Banner-images/' + data.id + '.jpg', (err, done) => {
          if (err) {
            console.log(err);
            throw err;
          } else {
            res.redirect('/admin/banner');
          }
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  },
  // admin add banner all functions End
  
  // adminEdit Banner sessions
  editBanner(req, res) {

    let productid = req.params.id

    try {
      editBanners(productid).then((product) => {
        res.render('adminviews/EditBanner', { user: false, product })
      }).catch((error) => {
        console.log(error)
        res.redirect('/admin/banner')
      })
    } catch (error) {
      console.log(error)
      res.redirect('/admin/banner')
    }

  },

  editedBanner(req, res) {
    try {
      let id = req.params.id
      console.log(id + "||||||||||||||||||||||||||||||||||||||");
      adminBannerEdit(req.params.id, req.body).then(() => {

        res.redirect('/admin/banner')

        console.log(req.file);
        if (req.files?.Image) {

          var image = req.files.Image
          image.mv('./public/Banner-images/' + id + '.jpg')

        }

      })
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal server error')
    }
  },
  // adminEdit all functions End //

  // today all order list session
  todayOrderList(req, res) {
    try {
      todayOrders().then((response) => {
        console.log(response);
        res.json(response)
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  // today all order list session End

  // week all order list session
  weekSales(req, res) {
    try {
      thisWeekOrders().then(() => {
        res.redirect('/admin/dashboard')
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  // week all order list session End

  // month all order list session
  monthSales(req, res) {
    try {
      thisMonthOrders().then(() => {
        res.redirect('/admin/dashboard')
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
    // month all order list session End

      // year all order list session
  yearSales(req, res) {
    try {
      thisYearOrders().then(() => {
        res.redirect('/admin/dashboard')
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
   // year all order list session End ///

  //  total revenue session
  totalRevenue(req, res) {
    try {
      totalRevenues().then((TotalRevenue) => {
        res.redirect('/admin/adminLoged')
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  //  total revenue session End

  // admin sales report sessions
  salesReport(req, res) {
    try {
      allSalesReport().then((salesReport) => {
        res.render('adminviews/SalesReport', { user: false, salesReport })
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  // admin sales report sessions End
  
  
  addCoupon(req, res) {
    try {
      res.render('adminviews/AddCoupon', { user: false });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  addedCoupon(req, res) {
    try {
      addCoupons(req.body).then(() => {
        allCouponDetails().then((Coupons) => {
          res.render('adminviews/Coupons', { user: false, Coupons });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  allCoupons(req, res) {
    try {
      allCouponDetails().then((Coupons) => {
        res.render('adminviews/Coupons', { user: false, Coupons });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  allOffers(req, res) {
    try {
      getAllProductOffer().then((ProductOffer) => {
        res.render('adminviews/Offers', { user: false, ProductOffer });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  categoryOffer(req, res) {
    try {
      let users = req.session.users
      res.render('adminviews/CategoryOffer', { user: true, users });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  showProductOffer(req, res) {
    try {
      getAllProductOffer().then((ProductOffer) => {
        res.render('adminviews/Offers', { user: false, ProductOffer });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
  showCategoryOffer(req, res) {
    try {
      getAllCategoryOffer().then((CategoryOffer) => {
        res.render('adminviews/ShowCategoryOffer', { user: false, CategoryOffer });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error occurred while retrieving category offer details.");
    }
  },

  editCoupon(req, res) {
    try {
      adminEditCoupon(req.params.id).then((coupon) => {
        res.render('adminviews/EditCoupon', { user: false, coupon });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error occurred while editing coupon.");
    }
  },

  editedCoupon(req, res) {
    try {
      adminEditedCoupon(req.params.id, req.body).then(() => {
        res.redirect('/admin/allCoupons');
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error occurred while updating coupon details.");
    }
  },

  deleteCoupon(req, res) {
    try {
      adminDeleteCoupon(req.params.id).then((response) => {
        res.redirect('/admin/allCoupons');
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error occurred while deleting coupon.");
    }
  }

}
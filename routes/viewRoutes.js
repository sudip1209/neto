const express = require("express");

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getOverview);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour); // This is the route that will be used to render the tour page
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
// router.post(
//   "/submit-user-data",
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;

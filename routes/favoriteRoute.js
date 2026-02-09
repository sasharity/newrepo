const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const favoriteController = require("../controllers/favoriteController")

router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.addFavorite)
)

router.get(
  "/",
  utilities.checkLogin,
  favoriteController.buildFavorites
)

router.post(
  "/remove",
  utilities.checkLogin,
  favoriteController.removeFavorite
)

module.exports = router

const favoriteModel = require("../models/favoriteModel")
const utilities = require("../utilities")


async function addFavorite(req, res, next) {
  try {
    // 1️⃣ Ensure user is logged in
    if (!res.locals.accountData) {
      req.flash("notice", "Please log in to save favorites.")
      return res.redirect("/account/login")
    }

    const account_id = res.locals.accountData.account_id
    const inv_id = parseInt(req.body.inv_id)

    if (!inv_id) {
      req.flash("notice", "Unable to save favorite.")
      return res.redirect("back")
    }

    const result = await favoriteModel.addFavorite(account_id, inv_id)

    if (!result) {
      req.flash("notice", "Unable to save favorite.")
    } else {
      req.flash("notice", "Vehicle saved to favorites!")
    }

    res.redirect("back")

  } catch (error) {
    next(error)
  }
}




async function buildFavorites(req, res) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const favorites = await favoriteModel.getFavoritesByAccount(account_id)

  res.render("favorites/index", {
    title: "My Favorite Vehicles",
    nav,
    favorites,
    errors: null
  })
}

async function removeFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const { inv_id } = req.body

  await favoriteModel.removeFavorite(account_id, inv_id)
  req.flash("notice", "Favorite removed.")
  res.redirect("/favorites")
}

module.exports = { addFavorite, buildFavorites, removeFavorite }

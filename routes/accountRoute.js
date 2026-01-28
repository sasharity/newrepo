// Resources declared so they can be used: express, new express router, utilities > index file and accounts controller
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route for the login view when "My Account" link is clicked.
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to register account
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router;
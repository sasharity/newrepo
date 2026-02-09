// Resources declared so they can be used: express, new express router, utilities > index file and accounts controller
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const invController = require("../controllers/invControllers")
const regValidate = require("../utilities/account-validation")
const validate = require("../utilities/account-validation")

// Route for the login view when "My Account" link is clicked.
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to register account
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))


// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
    validate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
  

// Route after being logged in to show the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to ensure the account logged in is either admin or employee
router.get("/add-inventory",
  utilities.checkEmployeeOrAdmin,
  invController.buildAddInventory
)

// Routers for the update account from views
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

router.post("/update",
    utilities.checkLogin,
    validate.updateRules(),
    validate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

router.post("/update-password",
  utilities.checkLogin,
  validate.passwordRules(),
  validate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", accountController.logout)


module.exports = router;
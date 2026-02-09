const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


// exports.buildLogin = async function (req, res) {
//   res.send("Login view coming soon...")
// }

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors:null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )


  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors:null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.session.account_id 
  const result = await accountModel.getAccountById(account_id)
  const accountData = Array.isArray(result) ? result[0] : result

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    errors: null,
    messages: req.flash()
  })
}

// Build the update view
async function buildUpdateView(req,res, next) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id
  const result = await accountModel.getAccountById(account_id)
  const accountData = Array.isArray(result) ? result[0] : result

  if (!accountData) {
    req.flash("error", "Account not found.")
    return res.redirect("/account")
  }

  res.render("account/update", {
    title: "Update Your Account",
    nav,
    accountData,
    errors: null,
    messages: req.flash()
  })
}

// The update account function
async function updateAccount(req, res) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const updateResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )



  if (!updateResult) {
    req.flash("error", "Account update failed.")
    return res.render("account/update", {
      title: "Update Account",
      nav: await utilities.getNav(),
      accountData: req.body,
      errors: null,
      messages: req.flash()
    })
  }

  // Fetch the updated account from DB
  const updatedResult = await accountModel.getAccountById(account_id)
  const accountData = Array.isArray(updatedResult) ? updatedResult[0] : updatedResult


  req.flash("notice", "Account information updated successfully.")
  res.render("account/management", {
    title: "Account Management",
    nav: await utilities.getNav(),
    accountData,
    messages: req.flash(),
    errors:null
  })
}

// The update password function
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("error", "Password hashing failed.")
    return res.redirect(`/account/update/${account_id}`)
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )

  if (!updateResult) {
    req.flash("error", "Password update failed.")
    return res.redirect(`/account/update/${account_id}`)
  }

  req.flash("notice", "Password updated successfully.")
  res.redirect("/account/")
}


const logout = async (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateView, updateAccount, updatePassword, logout }

/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const errorRoute = require("./routes/errorRoute")

/* ***********************
 * Routes
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //Not at views root

// Inventory routes
app.use("/inv", inventoryRoute)
app.use("/error", errorRoute)
/* ***********************
 * Routes
 *************************/
app.use(static)




// Index route 1 (First option but we will change to the MVC method)
// app.get("/", function (req, res) {
//   res.render("index", {title: "Home"})
// })

// Index route 2 (This follows the M_V_C methodology)
app.get("/", utilities.handleErrors(baseController.buildHome)
)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

// Intentional Error 500
// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav()
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`)
//   res.status(err.status || 500).render("errors/error", {
//     title: err.status || "Server Error",
//     message: err.message,
//     nav,
//   })
// })



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  const status = err.status || 500

  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  res.status(status).render("errors/error", {
    title: status,
    message: err.message,
    nav
  })
})




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

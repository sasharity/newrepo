// Resources declared so they can be used: express, new express router and inventory controller
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invControllers")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;
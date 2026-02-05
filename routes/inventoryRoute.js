// Resources declared so they can be used: express, new express router and inventory controller
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invControllers")
const utilities = require("../utilities")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")




// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildDetailView);
router.get("/", (invController.buildManagement))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));
router.post("/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Deliver inventory edit view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Route to handle incoming request
router.post("/update/", inventoryValidate.inventoryRules(), inventoryValidate.checkUpdateData,utilities.handleErrors (invController.updateInventory))





module.exports = router;
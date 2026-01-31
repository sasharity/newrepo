const { body, validationResult } = require("express-validator")
const utilities = require(".")

exports.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Invalid year."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Invalid price."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Invalid mileage."),
    body("inv_description").trim().notEmpty().withMessage("Description required."),
    body("classification_id").isInt().withMessage("Classification required."),
  ]
}

exports.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    )

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      errors: errors.array(),
      classificationList,
      ...req.body,
    })
  }
  next()
}

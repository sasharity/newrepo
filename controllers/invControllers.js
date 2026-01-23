const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
    const className = data[0].classification_name
    
    // learnt this as an alternative to help my nav display   
// const inventory = data.rows
// if (!inventory || inventory.length === 0) {
//   throw new Error("No inventory found for this classification")
// }
// const className = inventory[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont

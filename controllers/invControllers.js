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

// Build page to deliver a specific inventory item detail view
invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicle = await invModel.getDetailByInventoryId(inv_id)

    if (!vehicle) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    const vehicleHTML = utilities.buildDetailGrid(vehicle)
    let nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`, nav, 
      vehicleHTML,
    })
  } catch (error) {
    next(error)
  }
}

// controller function to build management view
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  });
}

// Function to add classification feature
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", { title: "Add Classification", nav, errors: null });
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.insertClassification(classification_name)

  if (result) {
    let nav = await utilities.getNav()
    req.flash("notice", "Classification added successfully.")

    return res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Failed to add classification.")

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  });
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_make, classification_id, inv_price } = req.body;

  const result = await invModel.insertInventory(inv_make, classification_id, inv_price);
  if(result){
    req.flash("notice", "Inventory added successfully.");
    res.redirect("/inv");
  } else {
    let classificationList = await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Failed to add inventory.");
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null
    });
  }
}


module.exports = invCont

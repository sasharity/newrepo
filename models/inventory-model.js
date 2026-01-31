const pool = require("../database/") //Because the file is index.js, it is the default file, and will be located inside the database folder without being specified. The path could also be ../database/index.js. It would return the same result.


/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// Function to retrieve the data for a specific vehicle in inventory
/* ***************************
 *  Get vehicle by inventory id
 * ************************** */
async function getDetailByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT * 
      FROM public.inventory
      WHERE inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]   // single vehicle
  } catch (error) {
    console.error("getDetailByInventoryId error " + error)
    throw error
  }
}

// Function to insert Classification name
async function insertClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    await pool.query(sql, [classification_name]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


async function insertInventory(inv_make, classification_id, inv_price){
  try {
    const sql = "INSERT INTO inventory (inv_make, classification_id, inv_price) VALUES ($1, $2, $3)";
    await pool.query(sql, [inv_make, classification_id, inv_price]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}




module.exports = { getClassifications, getInventoryByClassificationId, getDetailByInventoryId, insertClassification, insertInventory};

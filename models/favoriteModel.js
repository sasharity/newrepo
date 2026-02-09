const pool = require("../database")

async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `
  return pool.query(sql, [account_id, inv_id])
}

async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT i.*
    FROM inventory i
    JOIN favorites f ON i.inv_id = f.inv_id
    WHERE f.account_id = $1
  `
  const data = await pool.query(sql, [account_id])
  return data.rows
}

async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM favorites
    WHERE account_id = $1 AND inv_id = $2
  `
  return pool.query(sql, [account_id, inv_id])
}

module.exports = { addFavorite, getFavoritesByAccount, removeFavorite }

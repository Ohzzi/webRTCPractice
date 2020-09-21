const express = require('express')
const router = express.Router()
const mariaDB = require('mariadb')

const pool = mariaDB.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dhwlgns97@',
    database: 'webrtc'
})

async function selectAll() {
    let conn;
    try {
  
      conn = await pool.getConnection()
      const rows = await conn.query("SELECT * from USER")
      console.log(rows)
  
    } catch (err) {
      throw err
    } finally {
      if (conn) conn.release() //release to pool
    }
}

router.get('/', (req, res) => {
    res.render('signup')
})

router.post('/', (req, res) => {
    const body = req.body
    const id = body.id
    const pw = body.password
    const name = body.name
    const email = body.email

    selectAll()
})

module.exports = router
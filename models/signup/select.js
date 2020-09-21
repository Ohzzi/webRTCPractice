const connection = require('./connection')

module.exports = async function selectAll(name) {
    let conn;
    try {
      conn = await connection.getConnection()
      const rows = await conn.query("SELECT * from USER where name = '" + name + "';")
      if (rows[0]) {
        console.log(rows)
      } else {
        console.log('none')
      }
    } catch (err) {
      throw err
    } finally {
      if (conn) conn.release() //release to pool
    }
}
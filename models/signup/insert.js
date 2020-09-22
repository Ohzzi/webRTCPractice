const connection = require('./connection');

module.exports = async (body) => {
    let conn;
    try {
        conn = await connection.getConnection();
        const rows = await conn.query("SELECT * from USER where id = '" + body.id + "';");
        if (!rows[0]) {
            const query = await conn.query("insert into user (id, pw, name, email) values ('" + body.id + "','" + body.password + "','" + body.name + "','" + body.email + "');", (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("OK, DB insert");
                }
            });
        } else {
            console.log('중복');
        };
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
};
const connection = require('./connection');

module.exports = async (conn, body) => {
    try {
      if (rows[0]) {
        console.log('중복');
        return false;
      } else {
        console.log('중복 아님');
        return true;
      }
    } catch (err) {
      throw err;
    }
};
/*
REQUESTS CONSIST OF: 
 * email
 * password
DATA DEALT WITH:
 * password - r, w
 * email - w
*/
const {pool, updateIP, createIP} = require('./useful/sharedStuff')
const submit_email_password = async (req, res) => {
    try {
      const password = req.body.password;
      const email = req.body.email;
      const rowPassword = await pool.query("SELECT password FROM users WHERE email = $1", [email.toLowerCase()]);
      if (rowPassword.rowCount == 0) {
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email.toLowerCase(), password]);
        createIP(email, req.ip)
        res.status(250).json({
          message: 'GOToGO'
        })
      } else {
        if (password == rowPassword.rows[0].password) {
          updateIP(email, req.ip)
          res.status(250).json({
            message: 'GOToGO'
          })
        } else {
          res.status(400).json({
            error: 'Duplicate email',
            message: 'That email address is already in use. Please use a different password.'
          });
        }
      }
    } catch (error) {
      console.log(error)
    }
}
module.exports = submit_email_password
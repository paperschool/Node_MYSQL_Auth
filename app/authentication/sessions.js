// middle ware that is performed before an attempt to a secure page is made,
// this works by requesting if the session (is authenticated ) boolean is true
// if not it will force redirect the user to a page it should have access to
function checkSession (redirect = '/login') {
	return (req, res, next) => {
      // if successful transfer to next middleware
      if (req.isAuthenticated())
        return next();

      // if not successful redirect and kill chain
      res.redirect(redirect)
	}
}


var bcrypt = require('bcrypt');

function hashPlainText(plaintext,rounds = 10){
  // salting and hashing given password
  return bcrypt.hashSync(plaintext, bcrypt.genSaltSync(rounds));
}

function checkRole(role){
  return (req,res,next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.send(403);
    }
  }
}

module.exports.checkSession = checkSession;

module.exports.hashPlainText = hashPlainText;

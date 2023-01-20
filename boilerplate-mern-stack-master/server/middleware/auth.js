const { User } = require('../models/User');

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;  // cookies에 담겨있는 token을 이용

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user; // user정보를 가져옴
    next();
  });
};

module.exports = { auth };

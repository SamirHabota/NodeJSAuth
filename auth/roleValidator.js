valdiateRole = function (roles) {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else return res.sendStatus(403);
  };
};

module.exports = {
  valdiateRole,
};

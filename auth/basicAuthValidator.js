const validateAndInjectBasicAuthData = (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return res.sendStatus(403);
  }
  let base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  req.credentials = {
    username: credentials.split(":")[0],
    password: credentials.split(":")[1],
  };
  next();
};

module.exports = {
  validateAndInjectBasicAuthData,
};

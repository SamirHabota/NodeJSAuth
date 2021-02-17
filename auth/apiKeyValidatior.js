const validateApiKey = (req, res, next) => {
  var apiKey = req.headers["api-key"];
  if (
    apiKey === null ||
    apiKey === undefined ||
    apiKey !== process.env.API_KEY
  ) {
    return res.sendStatus(401);
  } else next();
};

module.exports = {
  validateApiKey,
};

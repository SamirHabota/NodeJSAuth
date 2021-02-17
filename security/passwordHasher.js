const crypto = require("crypto");

const generateSalt = (rounds) => {
  return crypto
    .randomBytes(Math.ceil(rounds / 2))
    .toString("hex")
    .slice(0, rounds);
};

const generateHash = (password, salt) => {
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  let hashedpassword = hash.digest("hex");
  return hashedpassword;
};

const compareHash = (password, hash, salt) => {
  let passwordHash = generateHash(password, salt);
  return passwordHash === hash;
};

module.exports = {
  generateSalt,
  generateHash,
  compareHash,
};

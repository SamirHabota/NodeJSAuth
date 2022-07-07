var express = require("express");
var router = express.Router();
const fs = require("fs");
const logger = fs.createWriteStream("./resources/users.txt", {
  flags: "a", // 'a' means appending (old data will be preserved)
});
const lineReader = require("line-reader"),
  Promise = require("bluebird");
var eachLine = Promise.promisify(lineReader.eachLine);
var { validateApiKey } = require("../auth/apiKeyValidatior");
const { v4: uuidv4 } = require("uuid");
var { authenticateJWT } = require("../auth/jwtValidator");
var { valdiateRole } = require("../auth/roleValidator");
var { generateSalt, generateHash } = require("../security/passwordHasher");

router.post(
  "/addNewUser",
  validateApiKey,
  authenticateJWT,
  valdiateRole("admin"),
  (req, res) => {
    //it's always a good idea to encrypt your passwords before sending them to the server
    //and then decrypt them on the server, with the same algorithm
    //the decryption would be done here, first

    //check if the passwords are matching
    if (req.body?.password !== req.body?.confirmPassword) {
      res.status(409);
      res.json({
        response: "The passwords did not match",
      });
    } else {
      //check if the username is already taken
      var sameUsername = false;
      eachLine("./resources/users.txt", function (line) {
        if (line.split(" ")[1] === req.body?.username) sameUsername = true;
      }).then(function () {
        if (sameUsername) {
          res.status(409);
          res.json({
            response: "The username is already taken",
          });
        } else {
          //hash the passwords to the database
          //never save them in plain text format
          var salt = generateSalt(15);
          var id = uuidv4();

          logger.write(
            id +
              " " +
              req.body?.username +
              " " +
              salt +
              " " +
              generateHash(req.body.password, salt) +
              " " +
              req.body?.role +
              " " +
              req.body?.active +
              "\n"
          );
          res.status(200);
          res.json({
            id: id,
            username: req.body?.username,
            role: req.body?.role,
            active: req.body?.active,
          });
        }
      });
    }
  }
);

router.get(
  "/getAllUsers",
  validateApiKey,
  authenticateJWT,
  valdiateRole("admin"),
  (req, res) => {
    var responseArray = [];
    eachLine("./resources/users.txt", function (line) {
      responseArray.push({
        id: line.split(" ")[0],
        username: line.split(" ")[1],
        role: line.split(" ")[4],
        active: line.split(" ")[5],
      });
    }).then(function () {
      res.json(responseArray);
    });
  }
);

router.get(
  "/me",
  validateApiKey,
  authenticateJWT,
  valdiateRole("admin;agent"),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;

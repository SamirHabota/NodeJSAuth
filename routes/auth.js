var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const lineReader = require("line-reader"),
  Promise = require("bluebird");
var eachLine = Promise.promisify(lineReader.eachLine);
const fs = require("fs");
const logger = fs.createWriteStream("./resources/signInLogs.txt", {
  flags: "a", // 'a' means appending (old data will be preserved)
});
var { compareHash } = require("../security/passwordHasher");

//dont send an api key to the login route
//even if the creditentials are incorect, the api key
//will be visible inside the developer tools of the browser
//the password field protects this route, instead of the api key
//send the api key only if user authentication successfully
router.post("/", function (req, res) {
  //read username and password from request body
  const { username, password } = req.body;

  //it is a good practice to tarck sign in attempts, and store them to the database, with their ip address
  var clientIp = username + " " + req.connection.remoteAddress;

  //validate user creditentials in database
  var user = {};
  var validUser = false;
  //in a real database: find the user by his unique username, then compare hashes
  eachLine("./resources/users.txt", function (line) {
    if (
      username === line.split(" ")[1] &&
      compareHash(password, line.split(" ")[3], line.split(" ")[2])
    ) {
      user.id = line.split(" ")[0];
      user.username = line.split(" ")[1];
      user.role = line.split(" ")[4];
      user.active = line.split(" ")[5];
      validUser = true;
    }
  }).then(function () {
    if (validUser) {
      //if user found, check if he is active
      if (user.active === "0") {
        res.status(403);
        logger.write(clientIp + " deactivated\n");
        res.json({ response: "The user has been deactivated" });
      } else {
        //generate access token
        const accessToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
            active: user.active,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "2h",
          }
        );
        logger.write(clientIp + " success\n");
        res.status(200);
        res.json({
          accessToken,
        });
      }
    } else {
      logger.write(clientIp + " denied\n");
      res.status(401);
      res.json({ response: "Invalid user creditentials" });
    }
  });
});

module.exports = router;

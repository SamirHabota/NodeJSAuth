# NodeJSAuth

## Introduction
This is a NodeJs startup project, meant to initialize a new backend API application, using Express, with all the user management and authentication features already build into it. 
The repository comes with four prebuild endpoints: add a new user, get the list of all users, authenticate and login a user, as well as get all user data.

The core of the startup app is JWT (Json Web Token) authorization. The endpoints are protected with an api key, and an access JWT to be accessed, of course except the login route.
Role management, sign in attempts and ip tracking, password decryption and more, are all initialized and ready to go.

No database has been hooked up to the API, instead a txt file system is used to simulate one, so that the user can connect a database of his choice to the server, later on in the project. All the data, simulating a database, can be found inside the `resources` folder (users and signInLogs .txt).

Additionaly, for frontend testing, especially using a JWT server integration, the base API has been deployed, and initialized. On how to use it, and more infomration, read the subheaders below.

## Installation
Prerequisites are having git (https://git-scm.com/downloads) and NodeJs (https://nodejs.org/en/download/) installed on your machine, additionaly a GitHub account. Download the repository as a zip file, or open a terminal of your choice, navigate to a desired directory and run the command `git clone repository_link` to get all the files.

Next open the terminal via a command line or from an IDE of your choice, inside the root directory and run the command `npm install` to install all the necessary dependencies. Lastly since the app is build using Express, run the command `npm start` to start the server. You will be greated by the API documentation, and the ednpoints will start to listen on port 3000.

## Endpotins
### `/auth`
This GET endpoint is used to authenticate the user. It accepts the user's username and password, and responds with the access JWT if the user is registered and active in the database. The endpoint expects the username and password to be sent as a Authorization Basic token to the headers Authorization field, which encrypts the username and password to a base64 string. Every login attempt is saved in the database (username that was typed in, ip address, as well as the success status).

#### response
```json
{
    "accessToken": "string"
}
```
### `/user/addNewUser`
This POST endpoint adds a new user to the database. Attributes can be expanded on. It expects an Authorization Bearer token, that can be received from the `/auth` endpoint on login, as well as the API key in its headers. Only a user with the role `admin` can access this endpoint. Roles, usernames, activities and ids are stored inside the JWT. The two main roles are `admin` and `agent`. The passwords are encrypted, and stored as hash and salt attributes inside the database.
#### request
```json
{
    "username":"string",
    "password":"string",
    "confirmPassword":"string", 
    "role":"agent",
    "active":"1 - 0"
}
```
#### response
```json
{
    "id":"string",
    "username":"string",    
    "role":"agent",
    "active":"1 - 0"
}
```
### `/user/getAllUsers`
This GET endpoint gets a list of json objects, that represent all the registered users in the app. It expects an Authorization Bearer token, that can be received from the `/auth` endpoint on login, as well as the API key in its headers. Only a user with the role `admin` can access this endpoint. Roles, usernames, activities and ids are stored inside the JWT. The two main roles are `admin` and `agent`.
#### response
```json
[
    {
        "id": "string",
        "username": "string",
        "role": "string",
        "active": "1 - 0"
    }
]
```
### `/user/me`
This GET endpoint fetches all the user data, based on the JWT. It expects an Authorization Bearer token, that can be received from the `/auth` endpoint on login, as well as the API key in its headers. Roles, usernames, activities and ids are stored inside the JWT. The two main roles are `admin` and `agent`.

#### response
```json
{
  "id": "string",
  "username": "string",
  "role": "string",
  "active": "1 - 0"
}
```
## Initial credentials and keys
An initial admin user must be seeded inside the database, to get access to any of the API's functionalities. There are two users seeded inside the .txt database, one administrator (username: admin, password: admin), and one agent (username: agent, password: agent). For simplicity, altough the passwords get hashed and kept with their salts in the database, they are not formatted to password standards. The final user can write out a desired regex as he wishes.

All the other keys (API and JWT key) can be found and modified in the `.env` file, inside the reposiroty:
```json
API_KEY="df057bbe-a609-4e38-92e6-b782840b19a8"
JWT_KEY="3efd26bf-e1df-4a4e-a837-67a122c00453"
```

## Heroku hosting
One of the options for deploying and hosting a NodeJs API server is Heroku (https://www.heroku.com). Prerequisites are having the heroku cli installed on your machine by running the command `npm install -g heroku`.

To host the server, go to Heroku, create an account and login. Create a new app, and either create a repository directly on Heroku, and push your code there, or to make use of "private" CI/CD: first publish the code on GitHhub, and then connect that GitHub repository to the Heroku app (or other Git services like GitLab or Gitbucket). By choosing the `master` branch, every commit or pull request to master, will automtically update your server. From there a SSL and domain name setup are further down the settings.

Lastly, to run the server on Heroku, a special file must be added to the root directory, with the execution command when hosted. For Heroku the file name should be `Procfile`, and if the server is build on Express the execution command should be `web: npm start`. Use `web: node app.js` or `web: node index.js` if using other or custom methods or scripts to run the server. This command can be viewed and changed from inside Heroku.

For frontend testing purposes, an instance of this startup app has been hosted on: https://node-js-auth-api.herokuapp.com.

/*
 * A very simple and insecure login example for node JS
 * using express
 * 
*/

// require express and set ports
const express = require("express");
const app = express();
const port = 3000;

// UUID
const { randomUUID } = require('crypto')

// other requirements and variables
const path = require('path')

// static files
app.use('/static', express.static('static'))

// body handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// login controller - would actually use a database
function login(username, password) {
    users = {
        "testuser": "testpassword",
        "someuser": "anotherpassword"
    }

    if (users[username] == password) // would be undefined if no such user
        return true;
    return false;
}

// session list - for UUID: login - could be put into a DB or similar
sessions = { }

// ROUTES

// Main Page (static HTML)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, '/html/index.html'));
});


// API Routes

// Check session to see if logged in
app.get("/api/checklogin/:sessionid", function (req, res) {
    // default response, not logged in
    response = {
        'login': false
    }
    sessionid = req.params.sessionid;
    // check session for login
    if (sessions[sessionid] != undefined && sessions[sessionid] != "")
    {
        response.login = true;
        console.log("Valid session for user: "+sessions[sessionid]+" logged in, SessionID: "+sessionid);
    }
    else
        console.log("Invalid session for SessionID: "+sessionid);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( response ));
});

// Logout from session
app.get("/api/logout/:sessionid", function (req, res) {
    sessionid = req.params.sessionid;
    if (sessions[sessionid] != undefined)
    {
        console.log("Logout request for user: "+sessions.sessionid+" for sessionID:"+sessionid);
        delete sessions[sessionid];
    }
    else   
        console.log("Illegal logout for sessionID:"+sessionid);
    response = {
        'login': false,
        'message': "You are logged out"
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( response ));
});

// Login to session
app.post("/api/login", function (req, res) {
    // default action login failed
    response = {
        'login': false,
        'message': ""
    }

    console.log("username:"+req.body.username+" password:"+req.body.password);
    if (login(req.body.username, req.body.password))
    {
        response.login=true;
        response.message="Logged in";
        // and create our session variables
        sessionid = randomUUID();
        sessions[sessionid] = req.body.username;
        response.sessionid = sessionid;
        console.log("User: "+req.body.username+" logged in, SessionID: "+sessionid);
    }
    else
    {
        response.message="Incorrect username or password";
        console.log("User: "+req.body.username+" failed login");
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify( response ));
});


// run express app
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

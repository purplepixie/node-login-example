/**
 * Client-side JS code for node login example
 */

// in memory storage - could also use browser local storage
var sessionid = "undefined"; // global session ID container

// login is clicked - try and login and update session
function loginClick()
{
    uri = "/api/login";
    console.log("Logging in via URI: "+uri);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var resp = JSON.parse(this.response);
        if (resp.login) // success
        {
            console.log("Logged in successfully");
            sessionid = resp.sessionid;
        }
        else
        {
            alert(resp.message);
            sessionid = "undefined";
        }
        document.getElementById('session_id').innerHTML = sessionid;
  }
  var params="username="+document.getElementById("login_username").value+"&password="+document.getElementById("login_password").value;
  xhttp.open("POST", uri, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
  xhttp.send(params);
}

// check the current session and display outcome
function checkLoginClick()
{
    document.getElementById('login_status').innerHTML = "Checking...";
    uri = "/api/checklogin/"+sessionid;
    console.log("Checking login via URI: "+uri);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var resp = JSON.parse(this.response);
        console.log(resp);
        var output = "NOT logged in";
        if (resp.login)
            output = "Logged in";
        document.getElementById('login_status').innerHTML = output;
  }
  xhttp.open("GET", uri);
  xhttp.send();
}

// call API route to login, do not update interface (check session should fail after this)
function logoutClick()
{
    uri = "/api/logout/"+sessionid;
    console.log("Logging out via URI: "+uri);
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var resp = JSON.parse(this.response);
        console.log(resp);
  }
  xhttp.open("GET", uri);
  xhttp.send();
}
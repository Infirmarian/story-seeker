import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { URL } from "../../../utils/constants";
import "./Login.css";
function Setup() {
  window.onAmazonLoginReady = function() {
    window.amazon.Login.setClientId(
      "amzn1.application-oa2-client.8497a1c842f24fd6b54cd7afef9ea32a"
    );
  };
  (function(d) {
    var a = d.createElement("script");
    a.type = "text/javascript";
    a.async = true;
    a.id = "amazon-login-sdk";
    a.src = "https://assets.loginwithamazon.com/sdk/na/login1.js";
    d.getElementById("amazon-root").appendChild(a);
  })(document);
}

function SetupGoogle() {
  var a = document.createElement("script");
  a.type = "text/javascript";
  a.async = true;
  a.src = "https://apis.google.com/js/platform.js?onload=renderButton";
  document.getElementsByClassName("g-signin2")[0].appendChild(a);
  var meta = document.createElement("meta");
  meta.name = "google-signin-client_id";
  meta.content =
    "821263154043-vtlolhs344g4b7fgpv908pevmrj0ockb.apps.googleusercontent.com";
  document.head.appendChild(meta);
}

function LoadAmazon(history) {
  let options = {};
  options.scope = "profile";
  options.scope_data = {
    profile: { essential: false },
  };
  options.response_type = "code";
  window.amazon.Login.authorize(options, (response) => {
    if (response.error) {
      alert("oauth error " + response.error);
      return false;
    }
    fetch(URL + "/api/login/amazon", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({ code: response.code }), // body data type must match "Content-Type" header
    })
      .then((data) => {
        if (data.status > 200) {
          console.error(data);
        } else {
          console.log("Successfully logged in");
          history.push("/viewer");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
  return false;
}

function Login() {
  useEffect(() => {
    Setup();
    SetupGoogle();
  }, []);
  let history = useHistory();
  return (
    <div>
      <div id="amazon-root"></div>
      <div className="wrapper">
        <div id="login-container">
          <h3 className="text-primary centered-text">
            Log in to create, save and publish stories for other users
          </h3>
          <div
            className="g-signin2"
            data-onsuccess="onSignIn"
            data-width="240"
            data-height="50"
          ></div>
          <div id="LoginWithAmazon">
            <img
              border="0"
              alt="Login with Amazon"
              src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_312x64.png"
              onClick={() => {
                LoadAmazon(history);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

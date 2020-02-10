import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { URL } from "../../../utils/constants";
function Setup() {
  window.onAmazonLoginReady = function() {
    window.amazon.Login.setClientId(
      "amzn1.application-oa2-client.819c3b24907c44f6928b93a7e4707e07"
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
    fetch(URL + "/api/login", {
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
          history.push("/403");
        } else {
          data.json().then((json) => {
            sessionStorage.setItem("token", json.token);
            sessionStorage.setItem("access", json.access);
            history.push("/");
          });
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
  }, []);
  let history = useHistory();
  return (
    <div>
      <div id="amazon-root"></div>
      <div id="textbox">
        <div className="login-container">
          <h3 className="text-primary centered-text">
            Log in with your Amazon Account to create, save and publish stories
            for other users
          </h3>
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

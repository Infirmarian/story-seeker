import React, { useEffect } from "react";
import {URL} from '../../../utils/constants';
import "./Login.css"
function Setup(){
    window.onAmazonLoginReady = function() {
        window.amazon.Login.setClientId('amzn1.application-oa2-client.8497a1c842f24fd6b54cd7afef9ea32a');
    };
    (function(d) {
        var a = d.createElement('script'); a.type = 'text/javascript';
        a.async = true; a.id = 'amazon-login-sdk';
        a.src = 'https://assets.loginwithamazon.com/sdk/na/login1.js';
        d.getElementById('amazon-root').appendChild(a);
    })(document);
}

function LoadAmazon(){
  let options = {}
    options.scope = 'profile';
    options.scope_data = {
        'profile' : {'essential': false} 
    };
    options.response_type='code'
    window.amazon.Login.authorize(options, (response) => {
        if ( response.error ) {
            alert('oauth error ' + response.error);
            return;
        }
        console.log(response);
        fetch(URL + '/api/login', {
            method: 'POST',
            mode: 'cors', 
            cache: 'no-cache',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify({code: response.code}) // body data type must match "Content-Type" header
        }).then((data) => {
            if(data.status !== 200){
               console.error(data);
            }else{
            console.log(data);
            }
        }).catch((error) => {
            console.error(error);
        });
    });
    return false;
}
function Login() {
  useEffect(() => {
    Setup();
  }, [])
  return <div>
    <div id="amazon-root"></div>
    <div id="textbox">
      <div className="login-container">
    <h3 className="text-primary centered-text">Log in with your Amazon Account to create, save and publish stories for other users</h3>
    <div id="LoginWithAmazon">
          
          <img border="0" alt="Login with Amazon"
          src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_312x64.png"
          width="156" height="32" onClick={LoadAmazon} />
      </div>
    </div>
          </div>
  </div>;
}

export default Login;

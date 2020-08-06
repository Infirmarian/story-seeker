// Copyright Robert Geil 2020
import React, { useEffect } from "react";
import { Auth as FirebaseAuth } from "../../components/Firebase";
import { auth } from "firebaseui";

const ui = new auth.AuthUI(FirebaseAuth());

export default function Login() {
  useEffect(() =>
    ui.start("#login", {
      signInOptions: [FirebaseAuth.GoogleAuthProvider.PROVIDER_ID],
      signInFlow: "popup",
      signInSuccessUrl: "/",
    })
  );
  return (
    <div>
      <h1>Login</h1>
      <div id="login"></div>
    </div>
  );
}

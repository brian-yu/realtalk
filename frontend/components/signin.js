import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useRouter } from "next/router";

import { useAuthContext } from "../context/auth";

function SignIn({ redirectPath }) {
  const authState = useAuthContext();
  const router = useRouter();

  if (authState.isSignedIn) {
    router.push("/home");
  }

  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={{ ...authState.uiConfig, signInSuccessUrl: redirectPath }}
        firebaseAuth={authState.firebase.auth()}
      />
    </div>
  );
}
export default SignIn;
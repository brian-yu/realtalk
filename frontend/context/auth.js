import { createContext, useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { useRouter } from "next/router";
// import { useAppContext } from "./app";

export const AuthContext = createContext();

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "redirect",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/home",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  // callbacks: {
  //   // Avoid redirects after sign-in.
  //   signInSuccessWithAuthResult: () => false,
  // },
};

export function AuthWrapper({ children }) {
//   const appState = useAppContext();
  let [authState, setAuthState] = useState({
    isSignedIn: false,
    currentUser: null,
    idToken: null,
    uid: null,
    firebase: firebase,
    uiConfig: uiConfig,
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged((user) => {
      if (user !== null) {
        user
          .getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            setAuthState({
              ...authState,
              isSignedIn: true,
              currentUser: user,
              idToken: idToken,
              uid: user.uid,
            });
            // appState.setAppState({
            //   ...appState,
            //   uid: user.uid,
            //   idToken: idToken,
            // });
          })
          .catch(function (error) {
            console.error("oops", error);
          });
      } else {
        console.log("");
        setAuthState({
          ...authState,
          isSignedIn: false,
          currentUser: null,
          idToken: null,
          uid: null,
          idToken: null,
        });
        // appState.setAppState({ ...appState, uid: null, idToken: null });
        router.push("/");
      }
    });
    return () => unsubscribe(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
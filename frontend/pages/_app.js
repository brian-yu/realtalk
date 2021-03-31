// import '../styles/globals.css'

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// export default MyApp

import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "firebase/app";
import ReactGA from "react-ga";

import AppNavbar from "../components/navbar";
import { AuthWrapper, useAuthContext } from "../context/auth";
import styles from "../styles/Index.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";

// Configure Firebase.
const config = {
  apiKey: "AIzaSyD-cYjWYpRX4r2AYLYLWG-lJqOBT_sjnX4",
  authDomain: "hoohacks-21.firebaseapp.com",
  projectId: "hoohacks-21",
  storageBucket: "hoohacks-21.appspot.com",
  messagingSenderId: "610307618457",
  appId: "1:610307618457:web:254783949497c06fcbea08",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const logAnalytics = (url) => {
    ReactGA.pageview(url);
  };

  useEffect(() => {
    ReactGA.initialize("UA-193524736-1");
    logAnalytics(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeComplete", logAnalytics);
    return () => {
      router.events.off("routeChangeComplete", logAnalytics);
    };
  }, []);

  return (
    <AuthWrapper>
      {/* <Navbar /> */}
      <AppNavbar />
      <Component {...pageProps} />
      <footer className={styles.footer}>
        © {new Date().getFullYear()} RealTalk
      </footer>
    </AuthWrapper>
  );
}

export default MyApp;

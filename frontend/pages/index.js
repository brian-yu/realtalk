import Head from "next/head";
import styles from "../styles/Index.module.css";
import SignIn from "../components/signin";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>RealTalk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to RealTalk!</h1>

        <p className={styles.description}>Get started by signing in.</p>

        <SignIn redirectPath="/home"></SignIn>
      </main>

      <footer className={styles.footer}>
        RealTalk
      </footer>
    </div>
  );
}

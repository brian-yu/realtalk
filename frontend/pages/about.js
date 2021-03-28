import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>RealTalk</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main className={styles.main}>
          About
      </main>
    </div>
  );
}

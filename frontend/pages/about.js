import Head from "next/head";
import { Container } from "react-bootstrap";
import styles from "../styles/Home.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>RealTalk</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Container>
        <img width="200px" src="/logo.png"/>
        <h1>About RealTalk</h1>
      </Container>
    </div>
  );
}

import Head from "next/head";
import Link from "next/link";
import { Button, Card, Container } from "react-bootstrap";
import styles from "../styles/Home.module.css";

import { people } from "../lib/people";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>RealTalk | Home</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Container>
        <h1>Home</h1>
        <div className={styles.cardGrid}>
          {people.map((person, idx) => {
            return (
              <Link href={`/chat/${person.id}`} key={idx}>
                <Card style={{ width: "18rem" }}>
                  <div className={styles.videoWrapper}>
                    <video
                      src={person.video}
                      width="256"
                      height="256"
                      loop
                      autoPlay={true}
                      muted
                      playsInline
                      webkit-playsinline="true"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>{person.name}</Card.Title>
                    <Card.Text>{person.bio}</Card.Text>
                    <Link href={`/chat/${person.id}`}>
                      <Button variant="primary">
                        Chat with {person.name.split(" ")[0]}
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

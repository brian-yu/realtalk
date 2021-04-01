import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";

import { BACKEND_HOST } from "../lib/constants";
import styles from "../styles/Home.module.css";

export default function Community() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_HOST}/profiles`)
      .then((response) => response.json())
      .then((data) => {
        setProfiles(data);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>RealTalk | Community</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Container>
        <h1>Community</h1>
        <div className={styles.cardGrid}>
          {profiles.map((person, idx) => {
            return (
              <Link href={`/chat/${person.id}`} key={idx}>
                <Card style={{ width: "18rem" }}>
                  <div className={styles.videoWrapper}>
                    <video
                      src={person.video_url}
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
                    <Card.Text>
                      <p>{person.bio}</p>
                      {person.uploaded_by ? (
                        <p>Uploaded by {person.uploaded_by}</p>
                      ) : null}
                    </Card.Text>
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

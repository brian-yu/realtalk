import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";

import {peopleMap} from "../../lib/people";
import styles from "../../styles/Chat.module.css";

function Message({ message }) {
  if (message === "") {
    return null;
  }

  const [from, text] = message.split(": ");
  return (
    <div>
      <b>{from}: </b>
      {text}
    </div>
  );
}

function Log({ prompt }) {
  if (!prompt) {
    return null;
  }

  prompt = prompt.split("\n\n")[1];
  prompt = prompt.replaceAll("Stranger:", "You:");
  prompt = prompt.replace(/You: ?$/, "");

  // console.log(prompt.split("\n"));

  return (
    <div>
      {prompt.split("\n").map((line, idx) => (
        <Message key={idx} message={line} />
      ))}
    </div>
  );
}

export default function Chat() {
  const router = useRouter();
  const { personId } = router.query;
  
  const person = peopleMap[personId];

  const [prompt, setPrompt] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [message, setMessage] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    if (!person) {
      return;
    }
    setPrompt(`The following is a conversation between a stranger and ${person.name}.\n\nStranger: Hello, who are you?\n${person.name}: I am ${person.name}.\nStranger: `);

    setVideoSrc(person.video);
  }, [person]);

  if (!person) {
    return null;
  }

  return (
    <Container>
      <Head>
        <title>RealTalk | Chat with {person.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h3>Chat with {person.name}</h3>

      <div className={styles.container}>
        <div>
          <Log prompt={prompt} />

          <InputGroup className="mb-3">
            <FormControl
              placeholder="Message"
              aria-label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <InputGroup.Append>
              <Button>Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        <div>
          <video
            ref={videoRef}
            src={videoSrc}
            width="450"
            height="450"
            no-controls
            loop
            autoPlay={true}
          />
        </div>
      </div>
    </Container>
  );
}

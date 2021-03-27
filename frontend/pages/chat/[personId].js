import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";

import { peopleMap } from "../../lib/people";
import styles from "../../styles/Chat.module.css";

const BACKEND_HOST = "http://localhost:5000";

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
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef) {
      logRef.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [logRef]);

  if (!prompt) {
    prompt = "";
  } else {
    prompt = prompt.split("\n\n")[1];
    prompt = prompt.replaceAll("Stranger:", "You:");
    prompt = prompt.replace(/You: ?$/, "");
  }

  // console.log(prompt.split("\n"));

  return (
    <div className={styles.log} ref={logRef}>
      {prompt.split("\n").map((line, idx) => (
        <Message key={idx} message={line} />
      ))}
    </div>
  );
}

async function postData(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export default function Chat() {
  const router = useRouter();
  const { personId } = router.query;

  const person = peopleMap[personId];

  const [prompt, setPrompt] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [sendDisabled, setSendDisabled] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    if (!person) {
      return;
    }
    setPrompt(
      `The following is a conversation between a stranger and ${person.name}.\n\nStranger: Hello, who are you?\n${person.name}: I am ${person.name}.`
    );

    setVideoSrc(person.video);
  }, [person]);

  if (!person) {
    return null;
  }

  const sendMessage = () => {
    if (sendDisabled) {
      return;
    }
    
    setSendDisabled(true);
    postData(`${BACKEND_HOST}/chat`, {
      message: message,
      person: person.name,
      prompt: prompt,
    }).then((data) => {
      setPrompt(data.prompt);
      setMessage("");
      setSendDisabled(false);
    });
  };

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
              disabled={sendDisabled}
            />
            <InputGroup.Append>
              <Button onClick={sendMessage} disabled={sendDisabled}>Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        <div>
          <video
            ref={videoRef}
            src={videoSrc}
            // width="512"
            // height="512"
            no-controls
            loop
            autoPlay={true}
          />
        </div>
      </div>
    </Container>
  );
}

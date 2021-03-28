import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  OverlayTrigger,
  Popover,
  Spinner,
} from "react-bootstrap";

import { peopleMap } from "../../lib/people";
import styles from "../../styles/Chat.module.css";

const BACKEND_HOST = "https://cold-impala-32.loca.lt";

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
  const [voiceCloningEnabled, setVoiceCloningEnabled] = useState(false);

  const loading = sendDisabled;

  const videoRef = useRef(null);

  console.log(person)

  const voiceCloningPopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Voice Cloning</Popover.Title>
      <Popover.Content>
        {person ?
        (person.voiceCloningAvailable ? "Voice cloning creates more realistic audio, but is much slower. ": `Voice cloning is disabled for ${person.name}`) : "Voice cloning is disabled"}
      </Popover.Content>
    </Popover>
  );

  useEffect(() => {
    if (!person) {
      return;
    }
    setPrompt(
      `The following is a conversation between a stranger and ${person.name}.\n\nStranger: Hello, who are you?\n${person.name}: I am ${person.name}, ${person.bio}.`
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
      personId: personId,
      voiceCloningEnabled: voiceCloningEnabled,
    }).then((data) => {
      setPrompt(data.prompt);
      console.log(data.video);
      videoRef.current.src = data.video;
      videoRef.current.loop = false;

      videoRef.current.addEventListener("ended", (e) => {
        e.target.src = person.video;
        e.target.loop = true;
      });
      setMessage("");
      setSendDisabled(false);
    });
  };

  return (
    <Container>
      <Head>
        <title>RealTalk | Chat with {person.name}</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <h3>Chat with {person.name}</h3>

      <div className={styles.container}>
        <div>
          <div className={styles.chatColumn}>
            <Log prompt={prompt} />
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Message"
                aria-label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
                disabled={sendDisabled}
              />
              <InputGroup.Append>
                <Button onClick={sendMessage} disabled={sendDisabled}>
                  Send
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
        <div className={styles.videoColumn}>
          <div className={styles.videoWrapper}>
            <video
              className={styles.video}
              ref={videoRef}
              src={videoSrc}
              width="512"
              height="512"
              loop
              autoPlay={true}
            />
          </div>
          <OverlayTrigger placement="bottom" overlay={voiceCloningPopover}>
            <Form.Switch
              label={person.voiceCloningAvailable ? "Enable voice cloning" : `Voice cloning is not available`}
              id="voice-cloning-switch"
              checked={voiceCloningEnabled}
              onChange={(e) => setVoiceCloningEnabled(e.target.checked)}
              disabled={!person.voiceCloningAvailable}
            />
          </OverlayTrigger>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spinner animation="border" />
              <span>
                <strong className={styles.loadingText}>
                  {person.name} is thinking...
                </strong>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}

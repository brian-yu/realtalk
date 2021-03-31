import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  OverlayTrigger,
  Popover,
  Spinner,
} from "react-bootstrap";

import { BACKEND_HOST } from "../../lib/constants";
import { peopleMap } from "../../lib/people";
import { postData } from "../../lib/util";
import { useAuthContext } from "../../context/auth";
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

export default function Chat() {
  const router = useRouter();
  const { personId } = router.query;

  const authState = useAuthContext();

  useEffect(() => {
    if (!personId || peopleMap.hasOwnProperty(personId)) {
      return;
    }
    fetch(`${BACKEND_HOST}/profile/${personId}`)
      .then((response) => response.json())
      .then((data) => {
        setPerson({
          name: data.name,
          id: personId,
          video: data.video_url,
          bio: data.bio,
          voiceCloningAvailable: false,
        });
      });
  }, [personId]);

  const [person, setPerson] = useState(peopleMap[personId]);

  const [prompt, setPrompt] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [sendDisabled, setSendDisabled] = useState(false);
  const [voiceCloningEnabled, setVoiceCloningEnabled] = useState(false);
  const [error, setError] = useState(null);

  const loading = sendDisabled;

  const videoRef = useRef(null);

  // console.log(person)

  const voiceCloningPopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Voice Cloning</Popover.Title>
      <Popover.Content>
        {person
          ? person.voiceCloningAvailable
            ? "Voice cloning creates more realistic audio, but is much slower. "
            : `Voice cloning is disabled for ${person.name}`
          : "Voice cloning is disabled"}
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
    setError(null);
    setSendDisabled(true);
    postData(`${BACKEND_HOST}/chat`, {
      message: message,
      person: person.name,
      prompt: prompt,
      personId: personId,
      videoUrl: person.video,
      voiceCloningEnabled: voiceCloningEnabled,
      userId: authState.uid,
      userIdToken: authState.idToken,
    }).then((data) => {
      if (data.ok) {
        setPrompt(data.prompt);
        console.log(data.video);
        videoRef.current.src = data.video;
        videoRef.current.loop = false;

        videoRef.current.addEventListener("ended", (e) => {
          e.target.src = person.video;
          e.target.loop = true;
        });
      } else {
        setError(data.message);
      }
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
            {!!error ? <Alert variant="danger">{error}</Alert> : null}
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
              playsInline
              webkit-playsinline="true"
            />
          </div>
          <OverlayTrigger placement="bottom" overlay={voiceCloningPopover}>
            <Form.Switch
              label={
                person.voiceCloningAvailable
                  ? "Enable voice cloning"
                  : `Voice cloning is not available`
              }
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

import { useMemo, useState } from "react";
import Head from "next/head";
import { useDropzone } from "react-dropzone";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";

import { BACKEND_HOST } from "../lib/constants";
import { useAuthContext } from "../context/auth";
import { postData, postFormData, toBase64 } from "../lib/util";
import styles from "../styles/Home.module.css";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function StyledDropzone({ setFile }) {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        if (file) {
          setFile(file);
        }
      });
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const acceptedFileItems = acceptedFiles.map((file) => (
    <p key={file.path}>{file.path}</p>
  ));

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />

        {acceptedFileItems.length > 0 ? (
          <div>{acceptedFileItems}</div>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
}

export default function Upload() {
  const authState = useAuthContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState(null);
  const [bio, setBio] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadData = () => {
    setError(null);
    setSuccess(null);
    if (!name || !bio || !file) {
      setError("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("userId", authState.uid);
    formData.append("userIdToken", authState.idToken);
    formData.append("image", file);

    setLoading(true);
    postFormData(`${BACKEND_HOST}/upload`, formData)
      .then((data) => {
        console.log("Success:", data);
        setLoading(false);

        if (data.ok) {
          setSuccess(true);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError("There was a problem uploading your profile.");
      });

    // toBase64(file).then((encodedImage) => {
    //   postData(`${BACKEND_HOST}/upload`, {
    //     name,
    //     bio,
    //     encodedImage,
    //     imageFileName: file.name,
    //   }).then((data) => {
    //     console.log(data);
    //   });
    // });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RealTalk | Upload</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Container>
        <h1>Upload</h1>
        {!!error ? <Alert variant="danger">{error}</Alert> : null}
        {!!success ? (
          <Alert variant="success">
            Your profile was uploaded successfully!
          </Alert>
        ) : null}
        <Form>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Alice Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            type="text"
            placeholder="an X who did Y"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Form.Label>Portrait Photo</Form.Label>
          <StyledDropzone setFile={setFile} />
          <br />
          <Button onClick={uploadData} disabled={loading}>
            Upload
          </Button>
          {loading ? <Spinner animation="border" /> : null}
        </Form>
      </Container>
    </div>
  );
}

import Link from "next/link";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import { useAuthContext } from "../context/auth";

export default function AppNavbar() {
  const authState = useAuthContext();

  if (!authState.isSignedIn) {
    return null;
  }
  
  const name = authState.currentUser.displayName.split(" ")[0];

  return (
    <Navbar className="bg-light justify-content-between" expand="lg">
      <Link href="/home">
        <Navbar.Brand href="/home">
        <img
        alt=""
        src="/logo.png"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}RealTalk</Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Item>
            <Link href="/home">
              <Nav.Link href="/home">Home</Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/community">
              <Nav.Link href="/community">Community</Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/upload">
              <Nav.Link href="/upload">Upload</Nav.Link>
            </Link>
          </Nav.Item>
        </Nav>
        <Nav className="ml-auto">
          <Nav.Item>
            {/* <Link href="/profile">
              <Nav.Link href="/profile">Hi, {name}!</Nav.Link>
            </Link> */}
            {/* <Nav.Link disabled>Hi, {name}!</Nav.Link> */}
            <p className="text-center mt-2 mb-2 mr-2">Hi, {name}!</p>
            {/* <p>Hi, {name}!</p> */}
          </Nav.Item>
          <Nav.Item>
            <Button
              href="#"
              onClick={() => authState.firebase.auth().signOut()}
              variant="outline-dark"
            >
              Sign Out
            </Button>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

import { useAppContext } from "../../context/state";

import Link from "next/link";

import { Nav, Button } from "react-bootstrap";

const Navbar = (props) => {
  // global app context
  const context = useAppContext();

  return (
    <div className="d-flex py-3 mb-4 border-bottom">
      <div className="flex-grow-1 d-flex align-items-center">
        <span className="fs-4 text-dark">XL Cinema</span>
      </div>
      <div>
        <Nav>
          <Nav.Item>
            <Link href="/" passHref>
              <Nav.Link
                className={
                  props.active == "home" ? "text-secondary" : "text-black"
                }
              >
                Home
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/movie" passHref>
              <Nav.Link
                className={
                  props.active == "movie" ? "text-secondary" : "text-black"
                }
              >
                Movies
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/info" passHref>
              <Nav.Link
                className={
                  props.active == "info" ? "text-secondary" : "text-black"
                }
              >
                Info
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Link href="/account" passHref>
            <Button variant="outline-dark ms-2">Account</Button>
          </Link>
        </Nav>
      </div>
    </div>
  );
};

export default Navbar;

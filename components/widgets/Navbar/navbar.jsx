import { useAppContext } from "../../context/state";

import Link from "next/link";

import { Nav, Button, Container } from "react-bootstrap";

const Navbar = (props) => {
  // global app context
  const context = useAppContext();

  return (
    <div className="border-bottom mb-4">
      <Container>
        <div className="d-md-flex py-3  ">
          <div className="flex-grow-1 d-flex align-items-center justify-content-center justify-content-md-start pt-2">
            <span className="fs-4 text-dark">XL Cinema</span>
          </div>
          <div className="d-flex align-items-center justify-content-center pt-2">
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
                <Link href="/account" passHref>
                  <Nav.Link
                    className={
                      props.active == "account" ? "text-secondary" : "text-black"
                    }
                  >
                    Account
                  </Nav.Link>
                </Link>
              </Nav.Item>
              {/* <Link href="/account" passHref>
                <Button variant="outline-dark ms-2">Account</Button>
              </Link> */}
            </Nav>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;

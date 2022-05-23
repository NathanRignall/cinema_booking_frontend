import { useAppContext } from "../context/state";

import Link from "next/link";

import { Navbar, Nav } from "react-bootstrap";

export default function EmployeeNavbar(props) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Link href="/" passHref>
        <Navbar.Brand>XL Cinima</Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/admin" passHref>
            <Nav.Link>Home</Nav.Link>
          </Link>

          <Link href="/admin/purchase" passHref>
            <Nav.Link>Purchase</Nav.Link>
          </Link>

          <Link href="/admin/movie" passHref>
            <Nav.Link>Movie</Nav.Link>
          </Link>

          <Link href="/admin/screen" passHref>
            <Nav.Link>Screen</Nav.Link>
          </Link>

          <Link href="/admin/screening" passHref>
            <Nav.Link>Screening</Nav.Link>
          </Link>

          <Link href="/admin/profile" passHref>
            <Nav.Link>Profile</Nav.Link>
          </Link>

          <Link href="/admin/type" passHref>
            <Nav.Link>Type</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

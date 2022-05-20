import { useAppContext } from "../context/state";

import Link from "next/link";

import { Navbar, Nav, NavDropdown, Dropdown, Badge } from "react-bootstrap";

export default function EmployeeNavbar(props) {
  // global app context
  const context = useAppContext();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Link href="/">
        <Navbar.Brand>XL Cinima</Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/admin">
            <Nav.Link href="/">Admin</Nav.Link>
          </Link>

          <Link href="/admin/movie">
            <Nav.Link href="/admin/movie">Movie</Nav.Link>
          </Link>

          <Link href="/admin/screen">
            <Nav.Link href="/admin/screen">Screen</Nav.Link>
          </Link>

          <Link href="/admin/screening">
            <Nav.Link href="/admin/screening">Screening</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

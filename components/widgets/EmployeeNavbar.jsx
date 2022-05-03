import { useAppContext } from "../context/state";

import Link from "next/link";

import { Navbar, Nav, NavDropdown, Dropdown, Badge } from "react-bootstrap";

export default function EmployeeNavbar(props) {
  // global app context
  const context = useAppContext();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Link href="/">
        <Navbar.Brand>Employee Admin</Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/employee">
            <Nav.Link href="/">Employee</Nav.Link>
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

          <Link href="/admin/reservation">
            <Nav.Link href="/admin/reservation">Reservation</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

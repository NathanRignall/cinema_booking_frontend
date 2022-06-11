import { useAppContext } from "../context/state";

import Link from "next/link";

import { Navbar, Nav, Dropdown, Badge } from "react-bootstrap";

export default function EmployeeNavbar(props) {
  // global app context
  const context = useAppContext();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="px-5">
      <Link href="/" passHref>
        <Navbar.Brand>XL Cinima</Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Link href="/admin" passHref>
            <Nav.Link active={props.active == "admin"}>Home</Nav.Link>
          </Link>

          <Link href="/admin/book" passHref>
            <Nav.Link active={props.active == "book"}>Book</Nav.Link>
          </Link>

          <Link href="/admin/settings/screening" passHref>
            <Nav.Link active={props.active == "settings"}>Settings</Nav.Link>
          </Link>

          <Link href="/admin/statistics" passHref>
            <Nav.Link active={props.active == "statistics"}>
              Statistics
            </Nav.Link>
          </Link>
        </Nav>

        <Nav>
          <Dropdown >
            <Dropdown.Toggle variant="outline-light" id="dropdown-basic" block>
              User Account
            </Dropdown.Toggle>

            <Dropdown.Menu align="right" className="text-center me-2">
              <Dropdown.Header className="pb-0 pt-1">
                <div>{context.email}</div>
              </Dropdown.Header>

              <Dropdown.Divider />

              <Link href="/admin/logout" passHref>
                <Dropdown.Item>Logout</Dropdown.Item>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

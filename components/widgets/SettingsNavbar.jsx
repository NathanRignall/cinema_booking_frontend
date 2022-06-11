import Link from "next/link";

import { Nav } from "react-bootstrap";

export default function SettingsNavbar(props) {
  return (
    <>
      <h1 className="pt-4 mb-2">Settings</h1>
      <Nav variant="tabs">
        <Nav.Item>
          <Link href="/admin/settings/screening" passHref>
            <Nav.Link active={props.active == "screening"}>Screenings</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/admin/settings/screen" passHref>
            <Nav.Link active={props.active == "screen"}>Screens</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/admin/settings/movie" passHref>
            <Nav.Link active={props.active == "movie"}>Movies</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/admin/settings/profile" passHref>
            <Nav.Link active={props.active == "profile"}>Profiles</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/admin/settings/type" passHref>
            <Nav.Link active={props.active == "type"}>Types</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link href="/admin/settings/user" passHref>
            <Nav.Link active={props.active == "user"}>Users</Nav.Link>
          </Link>
        </Nav.Item>
      </Nav>
      <br />
    </>
  );
}

import { useRouter } from "next/router";
import useSWR from "swr";

import { AppWrapper } from "../context/state";
import { fetcher } from "../common/functions";

import Navbar from "../widgets/Navbar";
import { Loader } from "../widgets/basic";

import { Container } from "react-bootstrap";

// settings layout for pages with auth
const Layout = (props) => {
  return (
    <div>
      <Container>
        <Navbar active={props.active}/>
        {props.children}
      </Container>
    </div>
  );
};

export default Layout;

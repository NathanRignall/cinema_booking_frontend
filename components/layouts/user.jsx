import { useRouter } from "next/router";
import useSWR from "swr";

import { AppWrapper } from "../context/state";
import { fetcher } from "../common/functions";

import Navbar from "../widgets/Navbar";
import { Loader } from "../widgets/basic";

import { Container } from "react-bootstrap";

// settings layout for pages with auth
const Layout = (props) => {
  // nextjs router
  const router = useRouter();

  // setup api connection
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_URL + "/session",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // check there is data in the request
  if (data) {
    if (error) {
      // some sort of error so push to login
      router.push({
        pathname: "/login",
        query: { destination_url: window.location.pathname },
      });
      return <Loader />;
    } else {
      return (
        <AppWrapper data={data.payload}>
          <div>
            <Navbar />
            <Container>{props.children}</Container>
          </div>
        </AppWrapper>
      );
    }
  } else {
    if (error) {
      router.push({
        pathname: "/login",
        query: { destination_url: window.location.pathname },
      });
      return <Loader />;
    } else {
      return <Loader />;
    }
  }
};

export default Layout;

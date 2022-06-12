import Layout from "../components/layouts/user";

import useSWR from "swr";
import Link from "next/link";

import { useAppContext } from "../components/context/state";
import { fetcher } from "../components/common/functions";
import { ErrorDisplayer } from "../components/widgets/basic";

import { Spinner, Card, Col, Row, Nav, Button } from "react-bootstrap";

// axios request urls
const PURCHASE_URI = process.env.NEXT_PUBLIC_API_URL + "/purchase";

const UserDetails = (props) => {
  // global app context
  const context = useAppContext();

  console.log(context);

  return (
    <>
      <h1 className="pt-2 mb-2 border-bottom">
        <div className="d-flex">
          <div className="flex-grow-1">{context.firstName} {context.lastName}</div> <div></div>
        </div>

        <p className="lead mb-2">
        {context.email}
        </p>
      </h1>
    </>
  );
};

// purchase Card
const Purchae = (props) => {
  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title>{props.info.cost}</Card.Title>

        </Card.Body>
      </Card>
      <br />
    </Col>
  );
};

// main list loader
const PurchaeList = (props) => {
  const { data, error } = useSWR(PURCHASE_URI, fetcher);

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Purchae key={item.id} info={item} />
    ));

    return (
      <>

          {FormedList}


        <ErrorDisplayer error={error} />
      </>
    );
  } else {
    return (
      <>
        <ErrorDisplayer error={error} />

        <div className="text-center">
          <Spinner animation="border" />
        </div>
      </>
    );
  }
};

// main app function
export default function Main() {
  return (
    <Layout title="Account" active="account">
      <UserDetails />
      <PurchaeList/>
    </Layout>
  );
}

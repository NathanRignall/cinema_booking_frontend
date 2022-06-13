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
          <div className="flex-grow-1">
            {context.firstName} {context.lastName}
          </div>
          <div>
            <Link href="/logout" passHref>
              <Button variant="secondary">Logout</Button>
            </Link>
          </div>
          <div></div>
        </div>

        <p className="lead mb-2">{context.email}</p>
      </h1>
    </>
  );
};

// purchase Card
const Purchae = (props) => {
  const date = new Date(props.info.screening.time);
  const dateString = date.toLocaleString();

  return (
    <Col>
      <Card>
        <Card.Header className="bg-dark text-white">
          <h3 className=" mb-2 ">
            <div>{props.info.screening.movie.title}</div>
            <p className="lead mb-2">
              {props.info.screening.screen.name} - {dateString}
            </p>
          </h3>
        </Card.Header>
        <Card.Body>
          <Card.Title></Card.Title>

          {props.info.reservations.map((item, index) => {
            return (
              <div key={index}>
                <h3 className=" mb-2 border-bottom">
                  <div className="d-flex">
                    <div className="flex-grow-1">Seat - {item.seatName}</div>
                    <div>£{(item.price / 100).toFixed(2)}</div>
                  </div>
                  <p className="lead mb-2">
                    {item.typeName} - {item.profileName}
                  </p>
                </h3>
              </div>
            );
          })}

          <div>
            <h3 className=" pt-2 mb-2 ">
              <div className="d-flex">
                <div className="flex-grow-1">Total</div>
                <div>£{(props.info.cost / 100).toFixed(2)}</div>
              </div>
            </h3>
          </div>

          <br />
          <Link href={`/ticket/${props.info.id}`} passHref>
            <Button variant="outline-dark" className="w-100" size="lg">
              View Ticket
            </Button>
          </Link>
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
      <br/>
      <PurchaeList />
    </Layout>
  );
}

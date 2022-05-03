import Layout from "../../components/layouts/default";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Card, Spinner, Alert } from "react-bootstrap";

// reservation Card
const Reservation = (props) => {
  const FormedList = props.info.seats.map((item) => (
    <div key={item.id}>{item.id}</div>
  ));

  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.id}</h4>
        </Card.Header>

        <Card.Body>
          {props.info.time}

          {FormedList}
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const ReservationList = (props) => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_URL + "/admin/reservation",
    fetcher
  );

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Reservation key={item.id} info={item} />
    ));

    return (
      <>
        <ErrorDisplayer error={error} />

        {data.payload.length > 0 ? (
          FormedList
        ) : (
          <Alert variant="warning">
            There are currently 0 xxx in the system.
          </Alert>
        )}
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
    <Layout title="Admin Movies" access={0}>
      <div className="d-flex">
        <h1>Reservation List</h1>
      </div>

      <br />
      <ReservationList />
    </Layout>
  );
}

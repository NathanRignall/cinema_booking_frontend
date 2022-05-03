import Layout from "../../components/layouts/default";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Card, Spinner, Alert } from "react-bootstrap";

// screening Card
const Screening = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.time}</h4>
        </Card.Header>

        <Card.Body>
          {props.info.movie.title}
          <br />
          {props.info.screen.name}
          <br />
          {props.info.id}
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const ScreeningList = (props) => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_URL + "/admin/screening",
    fetcher
  );

  if (data) {
    const FormedList = data.payload.map((item) => (
      <Screening key={item.id} info={item} />
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
        <h1>Screening List</h1>
      </div>

      <br />
      <ScreeningList />
    </Layout>
  );
}

import Layout from "../../components/layouts/default";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Card, Spinner, Alert } from "react-bootstrap";

// screen card
const Screen = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.name}</h4>
        </Card.Header>

        <Card.Body>
          {props.info.id}
          <br />
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const ScreenList = (props) => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_URL + "/admin/screen",
    fetcher
  );

  if (data) {
    const FormedList = data.payload.map((item) => (
      <Screen key={item.id} info={item} />
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
    <Layout title="Admin Screens" access={0}>
      <div className="d-flex">
        <h1>Screen List</h1>
      </div>

      <br />
      <ScreenList />
    </Layout>
  );
}

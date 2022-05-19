import Layout from "../../../components/layouts/default";

import Link from 'next/link'
import useSWR from "swr";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { ScreenCreateModal } from "../../../components/widgets/managers/screen";

import { Card, Spinner, Alert } from "react-bootstrap";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";

// screen card
const Screen = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <Link href={`/admin/screen/${props.info.id}`}>
            <h4 className="d-inline">{props.info.name}</h4>
          </Link>
        </Card.Header>

        <Card.Body>
          total setas - {props.info.totalSeats}
          <br />
          id - {props.info.id}
          <br />
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const ScreenList = (props) => {
  const { data, error } = useSWR(SCREEN_URI, fetcher);

  // check if data has loaded yet
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

        <div className="ml-auto my-auto">
          <ScreenCreateModal />
        </div>
      </div>

      <br />
      <ScreenList />
    </Layout>
  );
}
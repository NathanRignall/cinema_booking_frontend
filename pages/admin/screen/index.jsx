import Layout from "../../../components/layouts/employee";

import Link from "next/link";
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
          <Link href={`/admin/screen/${props.info.id}`} passHref>
            <h4 className="d-inline">{props.info.name}</h4>
          </Link>
        </Card.Header>

        <Card.Body>
          columns - {props.info.columns}
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
            There are currently 0 screens in the system.
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
    <Layout title="Admin Screens">
      <h1 className="pt-4 mb-2 border-bottom">Screens</h1>

      <div className="d-flex">
        <div className="ml-auto my-auto">
          <ScreenCreateModal />
        </div>
      </div>

      <br />
      <ScreenList />
    </Layout>
  );
}

import Layout from "../../components/layouts/employee";

import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";
import { Delete } from "../../components/widgets/managers/shared";

import { Card, Spinner, Alert } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// screening Card
const Screening = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <Link href={`/admin/screening/${props.info.id}`} passHref>
            <h4 className="d-inline">{props.info.time}</h4>
          </Link>
        </Card.Header>

        <Card.Body>
          {props.info.movie.title}
          <br />
          {props.info.screen.name}
          <br />
          {props.info.id}
          <br />
          <Delete
            url={`${SCREENING_URI}/${props.info.id}`}
            mutate_url={SCREENING_URI}
            type="Screening"
            name={props.info.movie.title}
          />
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const ScreeningList = (props) => {
  const { data, error } = useSWR(SCREENING_URI, fetcher);

  // check if data has loaded yet
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
            There are currently 0 screenings in the system.
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
    <Layout title="Purchase">
      <h1 className="pt-4 mb-2 border-bottom">Films</h1>

      <div className="d-flex">
        <div className="ml-auto my-auto">
          {/* <ScreeningCreateModal /> */}
        </div>
      </div>

      <br />
      IN DEV
    </Layout>
  );
}
import Layout from "../../components/layouts/default";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Card, Spinner, Alert } from "react-bootstrap";

// movie Card
const Movie = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.title}</h4>
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
const MovieList = (props) => {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_API_URL + "/admin/movie",
    fetcher
  );

  if (data) {
    const FormedList = data.payload.map((item) => (
      <Movie key={item.id} info={item} />
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
        <h1>Movie List</h1>
      </div>

      <br />
      <MovieList />
    </Layout>
  );
}

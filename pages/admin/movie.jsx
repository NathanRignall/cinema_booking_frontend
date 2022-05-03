import Layout from "../../components/layouts/default";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";
import { Delete } from "../../components/widgets/managers/shared";
import { MovieCreateModal } from "../../components/widgets/managers/movie";

import { Card, Spinner, Alert } from "react-bootstrap";

// axios request urls
const MOVIE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/movie";

// movie Card
const Movie = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.title}</h4>
        </Card.Header>

        <Card.Body>
          duration - {props.info.duration}
          <br />
          id - {props.info.id}
          <br />

          <Delete url={`${MOVIE_URI}/${props.info.id}`} mutate_url={MOVIE_URI} type="Movie" name={props.info.title}/>
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const MovieList = (props) => {
  const { data, error } = useSWR(MOVIE_URI, fetcher);

  // check if data has loaded yet
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
        <h1>Movie Lists</h1>

        <div className="ml-auto my-auto">
          <MovieCreateModal />
        </div>
      </div>

      <br />
      <MovieList />
    </Layout>
  );
}

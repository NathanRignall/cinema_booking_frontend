import Layout from "../../components/layouts/employee";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";
import { Delete } from "../../components/widgets/managers/shared";
import { MovieCreateModal } from "../../components/widgets/managers/movie";

import { Spinner, Table, Button } from "react-bootstrap";

// axios request urls
const MOVIE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/movie";

// movie Card
const Movie = (props) => {
  return (
    <>
      <tr>
        <td>{props.info.title}</td>
        <td>{props.info.duration}</td>
        <td className="d-flex justify-content-end">
          <div className="me-1">
            <Button variant="primary" size="sm">
              View
            </Button>
          </div>

          <div className="me-1">
            <Button variant="warning" size="sm">
              Edit
            </Button>
          </div>

          <div className="me-1">
            <Delete
              url={`${MOVIE_URI}/${props.info.id}`}
              mutate_url={MOVIE_URI}
              message="Delete"
              name={props.info.title}
              size="sm"
            />
          </div>
        </td>
      </tr>
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
        <Table striped bordered>
          <thead>
            <tr>
              <th>Movie Title</th>
              <th>Duration (Mins)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{FormedList}</tbody>
        </Table>

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
    <Layout title="Admin Movies">
      <h1 className="pt-4 mb-2 border-bottom">Movies</h1>

      <div className="d-flex">
        <div className="ml-auto my-auto">
          <MovieCreateModal />
        </div>
      </div>

      <br />
      <MovieList />
    </Layout>
  );
}

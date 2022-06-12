import Layout from "../../components/layouts/anonymous";

import useSWR from "swr";
import Link from "next/link";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Spinner, Card, Col, Row, Nav, Button} from "react-bootstrap";

// axios request urls
const MOVIE_URI = process.env.NEXT_PUBLIC_API_URL + "/movie";

// movie Card
const Movie = (props) => {
  return (
    <Col>
      <Card>
        <Card.Img
          variant="top"
          src="https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/styles/hc_1440x810/public/media/image/2022/04/iron-man-2684327.jpg?itok=ElxS4408"
        />
        <Card.Body>
          <Card.Title>{props.info.title}</Card.Title>
          <Link href={`/movie/${props.info.id}`} passHref>
                <Button variant="outline-dark">
                View Screenings
                </Button>
              </Link>
        </Card.Body>
      </Card>
      <br />
    </Col>
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
        <Row xs={1} md={2} className="g-4">
          {FormedList}
        </Row>

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
    <Layout title="Movies" active="movie">
      

      <br />
      <MovieList />
    </Layout>
  );
}

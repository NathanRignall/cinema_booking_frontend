import Layout from "../../components/layouts/employee";

import useSWR from "swr";
import Link from "next/link";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Spinner, Table, Col, Row, Nav, Button } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// screening Card
const Screening = (props) => {
  const date = new Date(props.info.time);
  const dateString = date.toLocaleString();

  return (
    <>
      <tr>
        <td>{props.info.movie.title}</td>
        <td>{props.info.movie.duration}</td>
        <td>{props.info.screen ? props.info.screen.name : "NULL"}</td>
        <td>{dateString}</td>
        <td>
          <div className="d-flex justify-content-end">
            <div className="me-1">
              <Link
                href={`/admin/book/${props.info.id}`}
                passHref
              >
                <Button variant="primary" size="sm">
                  Book
                </Button>
              </Link>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

// main list loader
const ScreeningList = (props) => {
  const { data, error } = useSWR(
    `${SCREENING_URI}?start=${props.startDate}&end=${props.endDate}`,
    fetcher
  );

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Screening
        key={item.id}
        info={item}
        startDate={props.startDate}
        endDate={props.endDate}
      />
    ));

    return (
      <>
        <ErrorDisplayer error={error} />

        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Movie Title</th>
              <th>Duration (Mins)</th>
              <th>Screen Name</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{FormedList}</tbody>
        </Table>
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
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate());

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 1);

  return (
    <Layout title="Movies" active="movie">
      <h1 className="pt-4  mb-2 border-bottom">
        <div className="d-flex mb-2">
          <div className="flex-grow-1">
            Today&apos;s Screenings
          </div>
        </div>
      </h1>
      <br />
      <ScreeningList
        startDate={startDate.toISOString()}
        endDate={endDate.toISOString()}
      />
    </Layout>
  );
}

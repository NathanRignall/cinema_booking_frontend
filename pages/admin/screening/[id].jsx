import Layout from "../../../components/layouts/default";

import { useRouter } from 'next/router'
import useSWR from "swr";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { Delete } from "../../../components/widgets/managers/shared";

import { Card, Spinner, Alert } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// screening Card
const ScreeningCard = (props) => {
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
const Screening = (props) => {
  const { data, error } = useSWR(`${SCREENING_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {
    return (
      <>
        <ErrorDisplayer error={error} />

        <ScreeningCard info={data.payload} />
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
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title="Admin Movies ID">
      {id != undefined ? <Screening id={id} /> : null}
    </Layout>
  );
}

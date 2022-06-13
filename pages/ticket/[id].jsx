import Layout from "../../components/layouts/user";

import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";

import QRCode from "react-qr-code";

import { useAppContext } from "../../components/context/state";
import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Spinner, Card, Col, Row, Nav, Button } from "react-bootstrap";

// axios request urls
const PURCHASE_URI = process.env.NEXT_PUBLIC_API_URL + "/purchase";

// main list loader
const Ticket = (props) => {
  const router = useRouter();

  const { data, error } = useSWR(`${PURCHASE_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {
    const date = new Date(data.payload.screening.time);
    const dateString = date.toLocaleString();

    return (
      <>
        <h1 className="pt-2 mb-2 border-bottom">
          <div className="d-flex">
            <div className="flex-grow-1">
              {data.payload.screening.movie.title}
            </div>
            <div>
              <Button onClick={() => router.back()} variant="secondary">
                Back
              </Button>
            </div>
          </div>

          <p className="lead mb-2">
            {data.payload.screening.screen.name} - {dateString}
          </p>
        </h1>

        <div className="d-flex justify-content-center pt-4">
          <QRCode value={props.id} />
        </div>
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
    <Layout title="Account" active="account">
      {id != undefined ? <Ticket id={id} router={router} /> : null}
    </Layout>
  );
}

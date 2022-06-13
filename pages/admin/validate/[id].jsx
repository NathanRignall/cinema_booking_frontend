import Layout from "../../../components/layouts/employee";

import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";

import QRCode from "react-qr-code";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";

import { Spinner, Card, Col, Row, Nav, Button } from "react-bootstrap";

// axios request urls
const PURCHASE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/purchase";

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
        <Card>
          <Card.Header className={data.payload.paid ? "bg-success text-white" :  "bg-dark text-white"}>
            <h3 className=" mb-2 ">
              <div>{data.payload.screening.movie.title}</div>
              <p className="lead mb-2">
                {data.payload.screening.screen.name} - {dateString}
              </p>
            </h3>
          </Card.Header>
          <Card.Body>
            <Card.Title></Card.Title>

            {data.payload.reservations.map((item, index) => {
              return (
                <div key={index}>
                  <h3 className=" mb-2 border-bottom">
                    <div className="d-flex">
                      <div className="flex-grow-1">Seat - {item.seatName}</div>
                      <div>£{(item.price / 100).toFixed(2)}</div>
                    </div>
                    <p className="lead mb-2">
                      {item.typeName} - {item.profileName}
                    </p>
                  </h3>
                </div>
              );
            })}

            <div>
              <h3 className=" pt-2 mb-2 ">
                <div className="d-flex">
                  <div className="flex-grow-1">Total</div>
                  <div>£{(data.payload.cost / 100).toFixed(2)}</div>
                </div>
              </h3>
            </div>

            <br />
          </Card.Body>
        </Card>
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

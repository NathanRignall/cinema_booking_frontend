import Layout from "../../components/layouts/anonymous";

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import {
  Spinner,
  Card,
  Col,
  Row,
  Nav,
  Tab,
  Tabs,
  Button,
} from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/screening";
const MOVIE_URI = process.env.NEXT_PUBLIC_API_URL + "/movie";

// screening card
const Screening = (props) => {
  const date = new Date(props.info.time);

  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title>
            {date.toLocaleTimeString("en-UK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Card.Title>

          <Card.Text>
            {date.toLocaleDateString("en-UK", {
              weekday: "long",
              day: "numeric",
              month: "2-digit",
            })}
          </Card.Text>

          <Link href={`/book/${props.info.id}`} passHref>
            <Button variant="outline-dark">Book</Button>
          </Link>
        </Card.Body>
      </Card>
      <br />
    </Col>
  );
};

// main list loader
const ScreeningList = (props) => {
  const { data, error } = useSWR(
    `${SCREENING_URI}?movieId=${props.id}&start=${props.startDate}&end=${props.endDate}`,
    fetcher
  );

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Screening key={item.id} info={item} />
    ));

    return (
      <>
        <Row xs={3} md={6} className="g-4">
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

function ScreeningsTabs(props) {
  const [key, setKey] = useState(0);

  const days = [];

  for (let i = 0; i < 4; i++) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() + i * 7);

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + i * 7 + 7);

    days.push({
      startDate: startDate,
      endDate: endDate,
    });
  }

  const TabsFormedList = days.map((date, index) => (
    <Tab
      key={index}
      eventKey={index}
      className="text-secondary"
      title={date.startDate.toLocaleDateString("en-UK", {
        day: "numeric",
        month: "2-digit",
      })}
    ></Tab>
  ));

  return (
    <>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 "
      >
        {TabsFormedList}
      </Tabs>

      <ScreeningList
        id={props.id}
        startDate={days[key].startDate.toISOString()}
        endDate={days[key].endDate.toISOString()}
      />
    </>
  );
}

// main movie loader
const Movie = (props) => {
  const router = useRouter();

  const { data, error } = useSWR(`${MOVIE_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {
    return (
      <>
        <h1 className="pt-2 mb-2 border-bottom">
          <div className="d-flex">
            <div className="flex-grow-1">{data.payload.title}</div>{" "}
            <div>
              <Button onClick={() => router.back()} variant="secondary">
                Back
              </Button>
            </div>
          </div>

          <p className="lead mb-2">{data.payload.duration} Minutes</p>
        </h1>

        <br />
        <ScreeningsTabs id={props.id} />

        <br />
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
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title="Movies" active="movie">
      {id != undefined ? <Movie id={id} /> : null}
    </Layout>
  );
}

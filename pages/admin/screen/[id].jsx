import Layout from "../../../components/layouts/default";

import React from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { Delete } from "../../../components/widgets/managers/shared";
import CinemaLayout from "../../../components/widgets/CinemaLayout";

import { Card, Spinner, Alert } from "react-bootstrap";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";

// screening Card
const ScreenCard = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.name}</h4>
        </Card.Header>

        <Card.Body>
          <CinemaLayout {...props.info} edit={true} />
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const Screen = (props) => {
  const { data, error } = useSWR(`${SCREEN_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {
    return (
      <>
        <ErrorDisplayer error={error} />

        <ScreenCard info={data.payload} />
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
    <Layout title="Admin Screens ID">
      {id != undefined ? <Screen id={id} /> : null}
    </Layout>
  );
}

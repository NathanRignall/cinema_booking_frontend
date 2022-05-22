import Layout from "../../../components/layouts/default";

import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { Delete } from "../../../components/widgets/managers/shared";
import CinemaLayout from "../../../components/widgets/CinemaLayout";

import { Card, Spinner, Button } from "react-bootstrap";

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
          <CinemaLayout
            screen={props.info}
            edit={true}
            selectable={false}
            purchase={false}
          />
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
        <h1 className="pt-4 mb-2 border-bottom">
          {data.payload.name}

          <p className="lead mb-2">{data.payload.columns} Columns</p>
        </h1>

        <div>
          <Button variant="warning" className="me-2">
            Edit Screen
          </Button>

          <Delete
            url={`${SCREEN_URI}/${data.payload.id}`}
            mutate_url={SCREEN_URI}
            type="Screen"
            name={data.payload.name}
            redirect={"/admin/screen"}
          />
        </div>

        <CinemaLayout
          screen={data.payload}
          edit={true}
          selectable={false}
          purchase={false}
        />

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
    <Layout title="Admin Screens ID">
      {id != undefined ? <Screen id={id} /> : null}
    </Layout>
  );
}

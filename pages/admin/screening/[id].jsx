import Layout from "../../../components/layouts/employee";

import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { Delete } from "../../../components/widgets/managers/shared";
import CinemaLayout from "../../../components/widgets/CinemaLayout";

import { Spinner, Button } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// main list loader
const Screening = (props) => {
  const { data, error } = useSWR(`${SCREENING_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {

    const date = new Date(data.payload.time);
    const dateString = date.toLocaleString();

    return (
      <>
        <h1 className="pt-4 mb-2 border-bottom">
          {data.payload.movie.title}

          <p className="lead mb-2">
            {data.payload.screen.name} - {dateString}
          </p>
        </h1>

        <div>
          <div className="me-2 d-inline">
            <Button variant="warning">Edit</Button>
          </div>

          <div className="me-2 d-inline">
          <Delete
            url={`${SCREENING_URI}/${data.payload.id}`}
            mutate_url={SCREENING_URI}
            message="Delete"
            name={`${data.payload.movie.title} Screening`}
            redirect={"/admin/screening"}
          />
          </div>
        </div>

        <CinemaLayout
          screeningId={data.payload.id}
          screen={data.payload.screen}
          edit={false}
          selectable={true}
          purchase={true}
        />

        <br/>
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
    <Layout title="Admin Movies ID">
      {id != undefined ? <Screening id={id} router={router} /> : null}
    </Layout>
  );
}

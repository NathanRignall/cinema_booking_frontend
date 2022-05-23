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
    return (
      <>
        <h1 className="pt-4 mb-2 border-bottom">
          {data.payload.movie.title}

          <p className="lead mb-2">
            {data.payload.screen.name} - {data.payload.time}
          </p>
        </h1>

        <div>
          <Button variant="primary" className="me-2">
            Edit Screening
          </Button>

          <Delete
            url={`${SCREENING_URI}/${data.payload.id}`}
            mutate_url={SCREENING_URI}
            type="Screening"
            name={data.payload.movie.title}
            redirect={"/admin/screening"}
          />
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

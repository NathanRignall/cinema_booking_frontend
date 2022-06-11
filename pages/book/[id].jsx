import Layout from "../../components/layouts/user";

import React, { useState, useEffect} from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";
import CinemaLayout from "../../components/widgets/CinemaLayout";

import { Spinner, Button } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/screening";
const PROFILE_URI = process.env.NEXT_PUBLIC_API_URL + "/profile";

// main screening loader
const Screening = (props) => {
  const router = useRouter();

  const { data, error } = useSWR(`${SCREENING_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {
    const date = new Date(data.payload.time);
    const dateString = date.toLocaleString();

    return (
      <>
        <h1 className="pt-2 mb-2 border-bottom">
          <div className="d-flex">
            <div className="flex-grow-1">{data.payload.movie.title}</div>{" "}
            <div>
              <Button onClick={() => router.back()} variant="secondary">
                Back
              </Button>
            </div>
          </div>

          <p className="lead mb-2">
            {data.payload.screen.name} - {dateString}
          </p>
        </h1>

        <CinemaLayout
          screeningId={data.payload.id}
          screen={data.payload.screen}
          edit={false}
          selectable={false}
          reservable={true}
          purchase={false}
          profiles={props.profiles}
        />

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

  const { data, error } = useSWR(PROFILE_URI, fetcher, {
    revalidateOnFocus: false,
  });

  const [ profiles, setProfiles ] = useState([]);

  useEffect(() => {
    if (data) {
      setProfiles(data.payload);
    }
  }, [data]);

  return (
    <Layout title="Screening" active="screening">
      {id != undefined ? (
        <Screening id={id} router={router} profiles={profiles} />
      ) : null}
      <ErrorDisplayer error={error} />
    </Layout>
  );
}

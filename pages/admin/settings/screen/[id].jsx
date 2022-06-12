import Layout from "../../../../components/layouts/employee";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcher } from "../../../../components/common/functions";
import { ErrorDisplayer } from "../../../../components/widgets/basic";
import { Delete } from "../../../../components/widgets/managers/shared";
import CinemaLayout from "../../../../components/widgets/CinemaLayout";

import { Table, Tabs, Tab, Spinner, Button } from "react-bootstrap";
import { SeatBulkCreateModal } from "../../../../components/widgets/managers/seat";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// table entry for screening
const Screening = (props) => {
  const date = new Date(props.time);
  const dateString = date.toLocaleString();

  return (
    <tr>
      <td>{props.movie.title}</td>
      <td>{dateString}</td>
      <td>
        <div className="d-flex justify-content-end">
          <div className="me-1">
            <Link href={`/admin/settings/screening/${props.id}`} passHref>
              <Button variant="primary" size="sm">
                View
              </Button>
            </Link>
          </div>

          {/* <div className="me-1">
            <Button variant="warning" size="sm">
              Edit
            </Button>
          </div> */}

          <div className="me-1">
            <Delete
              url={`${SCREENING_URI}/${props.id}`}
              mutate_url={`${SCREENING_URI}/find?start=${props.startDate}&end=${props.endDate}&screen${props.screen}`}
              message="Delete"
              name={`${props.movie.title} Screening`}
              size="sm"
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

const Screenings = (props) => {
  const { data, error } = useSWR(
    `${SCREENING_URI}/find?start=${props.startDate}&end=${props.endDate}&screen${props.screen}`,
    fetcher
  );

  if (data) {
    const ScreeningsFormedList = data.payload.map((screening) => (
      <Screening key={screening.id} {...screening} screen={props.screen} startDate={props.startDate} endDate={props.endDate}/>
    ));

    return (
      <>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Movie Title</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{ScreeningsFormedList}</tbody>
        </Table>

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
  const [key, setKey] = useState(2);

  const days = [];

  for (let i = -2; i < 2; i++) {
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
        className="mb-3"
      >
        {TabsFormedList}
      </Tabs>

      <Screenings
        startDate={days[key].startDate.toISOString()}
        endDate={days[key].endDate.toISOString()}
        screen={props.id}
      />
    </>
  );
}

// main list loader
const Screen = (props) => {
  const router = useRouter();

  const { data, error } = useSWR(`${SCREEN_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <>
        <h1 className="pt-4 mb-2 border-bottom">
          <div className="d-flex">
            <div className="flex-grow-1"> {data.payload.name}</div>{" "}
            <div>
              <Button onClick={() => router.back()} variant="secondary">
                Back
              </Button>
            </div>
          </div>

          <p className="lead mb-2">
            {data.payload.columns} Columns - {data.payload.seats.length} Total
            Seats
          </p>
        </h1>

        <div>
          {/* <div className="me-2 d-inline">
            <Button variant="warning">Edit</Button>
          </div> */}

          <div className="me-2 d-inline">
            <Delete
              url={`${SCREEN_URI}/${data.payload.id}`}
              mutate_url={SCREEN_URI}
              message="Delete"
              name={data.payload.name}
              redirect={"/admin/settings/screen"}
            />
          </div>

          {data.payload.seats == 0 ? (
            <div className="me-2 d-inline">
              <SeatBulkCreateModal
                screen={{
                  id: data.payload.id,
                  columns: data.payload.columns,
                }}
              />
            </div>
          ) : null}
        </div>

        <CinemaLayout
          screen={data.payload}
          edit={true}
          selectable={true}
          purchase={false}
          delete={true}
        />

        <h3>Screenings</h3>
        <ScreeningsTabs id={data.payload.id} />

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
    <Layout title="Admin Settings" active="settings">
      {id != undefined ? <Screen id={id} /> : null}
    </Layout>
  );
}

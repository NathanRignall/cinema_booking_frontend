import Layout from "../../../../components/layouts/employee";

import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "../../../../components/common/functions";
import { ErrorDisplayer } from "../../../../components/widgets/basic";
import { Delete } from "../../../../components/widgets/managers/shared";
import { ScreeningCreateModal } from "../../../../components/widgets/managers/screening";
import SettingsNavbar from "../../../../components/widgets/SettingsNavbar";

import { Table, Spinner, Button } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// screening Card
const Screening = (props) => {
  const date = new Date(props.info.time);
  const dateString = date.toLocaleString();

  return (
    <>
      <tr>
        <td>{props.info.movie.title}</td>
        <td>{props.info.movie.duration}</td>
        <td>{props.info.screen.name}</td>
        <td>{dateString}</td>
        <td>
          <div className="d-flex justify-content-end">
            <div className="me-1">
              <Link href={`/admin/settings/screening/${props.info.id}`} passHref>
                <Button variant="primary" size="sm">
                  View
                </Button>
              </Link>
            </div>

            <div className="me-1">
              <Button variant="warning" size="sm">
                Edit
              </Button>
            </div>

            <div className="me-1">
              <Delete
                url={`${SCREENING_URI}/${props.info.id}`}
                mutate_url={SCREENING_URI}
                message="Delete"
                name={`${props.info.movie.title} Screening`}
                size="sm"
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

// main list loader
const ScreeningList = (props) => {
  const { data, error } = useSWR(SCREENING_URI, fetcher);

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Screening key={item.id} info={item} />
    ));

    return (
      <>
        <ErrorDisplayer error={error} />

        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Movie Title</th>
              <th>Duration (Mins)</th>
              <th>Screen Name</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{FormedList}</tbody>
        </Table>
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
  return (
    <Layout title="Admin Settings" active="settings">

      <SettingsNavbar active="screening" />

      <div className="d-flex pb-2 justify-content-end">
        <div className="ml-auto my-auto">
          <ScreeningCreateModal />
        </div>
      </div>

      <ScreeningList />
    </Layout>
  );
}

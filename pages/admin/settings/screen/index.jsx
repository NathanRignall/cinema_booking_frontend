import Layout from "../../../../components/layouts/employee";

import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "../../../../components/common/functions";
import { ErrorDisplayer } from "../../../../components/widgets/basic";
import { Delete } from "../../../../components/widgets/managers/shared";
import { ScreenCreateModal } from "../../../../components/widgets/managers/screen";
import SettingsNavbar from "../../../../components/widgets/SettingsNavbar";

import { Table, Spinner, Button } from "react-bootstrap";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";

// screen card
const Screen = (props) => {
  return (
    <>
      <tr>
        <td>{props.info.name}</td>
        <td>{props.info.columns}</td>
        <td>
          <div className="d-flex justify-content-end">
            <div className="me-1">
              <Link href={`/admin/settings/screen/${props.info.id}`} passHref>
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
                url={`${SCREEN_URI}/${props.info.id}`}
                mutate_url={SCREEN_URI}
                message="Delete"
                name={`${props.info.name}`}
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
const ScreenList = (props) => {
  const { data, error } = useSWR(SCREEN_URI, fetcher);

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Screen key={item.id} info={item} />
    ));

    return (
      <>
        <ErrorDisplayer error={error} />

        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Screen Name</th>
              <th>Screen Columns</th>
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

      <SettingsNavbar active="screen" />

      <div className="d-flex pb-2 justify-content-end">
        <div className="ml-auto my-auto">
          <ScreenCreateModal />
        </div>
      </div>

      <ScreenList />
    </Layout>
  );
}

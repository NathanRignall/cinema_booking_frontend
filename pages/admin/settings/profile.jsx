import Layout from "../../../components/layouts/employee";

import useSWR from "swr";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { Delete } from "../../../components/widgets/managers/shared";
import { ProfileCreateModal } from "../../../components/widgets/managers/profile";
import SettingsNavbar from "../../../components/widgets/SettingsNavbar";

import { Table, Spinner, Button } from "react-bootstrap";

// axios request urls
const PROFILE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/profile";

// profile Card
const Profile = (props) => {
  return (
    <>
      <tr>
        <td>{props.info.name}</td>
        <td>{props.info.price}%</td>
        <td>
          <div className="d-flex justify-content-end">
            <div className="me-1">
              <Button variant="warning" size="sm">
                Edit
              </Button>
            </div>

            <div className="me-1">
              <Delete
                url={`${PROFILE_URI}/${props.info.id}`}
                mutate_url={PROFILE_URI}
                message="Delete"
                name={props.info.name}
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
const ProfileList = (props) => {
  const { data, error } = useSWR(PROFILE_URI, fetcher);

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Profile key={item.id} info={item} />
    ));

    return (
      <>
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Profile Name</th>
              <th>Discount Precentage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{FormedList}</tbody>
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

// main app function
export default function Main() {
  return (
    <Layout title="Admin Settings" active="settings">
      <SettingsNavbar active="profile" />

      <div className="d-flex pb-2 justify-content-end">
        <div className="ml-auto my-auto">
          <ProfileCreateModal />
        </div>
      </div>

      <ProfileList />
    </Layout>
  );
}

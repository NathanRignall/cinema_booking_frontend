import Layout from "../../components/layouts/default";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";
import { Delete } from "../../components/widgets/managers/shared";
import { ProfileCreateModal } from "../../components/widgets/managers/profile";

import { Card, Spinner, Alert } from "react-bootstrap";

// axios request urls
const PROFILE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/profile";

// profile Card
const Profile = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.name}</h4>
        </Card.Header>

        <Card.Body>
          price - {props.info.price}
          <br />
          id - {props.info.id}
          <br />
          <Delete
            url={`${PROFILE_URI}/${props.info.id}`}
            mutate_url={PROFILE_URI}
            type="Profile"
            name={props.info.name}
          />
        </Card.Body>
      </Card>
      <br />
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
        <ErrorDisplayer error={error} />

        {data.payload.length > 0 ? (
          FormedList
        ) : (
          <Alert variant="warning">
            There are currently 0 profiles in the system.
          </Alert>
        )}
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
    <Layout title="Admin Profile">
      <h1 className="pt-4 mb-2 border-bottom">Profiles</h1>

      <div className="d-flex">
        <div className="ml-auto my-auto">
          <ProfileCreateModal />
        </div>
      </div>

      <br />
      <ProfileList />
    </Layout>
  );
}

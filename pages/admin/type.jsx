import Layout from "../../components/layouts/employee";

import useSWR from "swr";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";
import { Delete } from "../../components/widgets/managers/shared";
import { TypeCreateModal } from "../../components/widgets/managers/type";

import { Card, Spinner, Alert } from "react-bootstrap";

// axios request urls
const TYPE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/type";

// type Card
const Type = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.name}</h4>
        </Card.Header>

        <Card.Body>
          price - £{props.info.price /100}
          <br />
          id - {props.info.id}
          <br />
          <Delete
            url={`${TYPE_URI}/${props.info.id}`}
            mutate_url={TYPE_URI}
            type="Type"
            name={props.info.name}
          />
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const TypeList = (props) => {
  const { data, error } = useSWR(TYPE_URI, fetcher);

  // check if data has loaded yet
  if (data) {
    const FormedList = data.payload.map((item) => (
      <Type key={item.id} info={item} />
    ));

    return (
      <>
        <ErrorDisplayer error={error} />

        {data.payload.length > 0 ? (
          FormedList
        ) : (
          <Alert variant="warning">
            There are currently 0 types in the system.
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
    <Layout title="Admin Type">
      <h1 className="pt-4 mb-2 border-bottom">Types</h1>

      <div className="d-flex">
        <div className="ml-auto my-auto">
          <TypeCreateModal />
        </div>
      </div>

      <br />

      <TypeList />
    </Layout>
  );
}

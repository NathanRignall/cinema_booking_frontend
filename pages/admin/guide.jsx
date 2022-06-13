import Layout from "../../components/layouts/employee";

import useSWR from "swr";
import Link from "next/link";

import { fetcher } from "../../components/common/functions";
import { ErrorDisplayer } from "../../components/widgets/basic";

import { Spinner, Table, Col, Row, Nav, Accordion } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// main app function
export default function Main() {
  return (
    <Layout title="Guides" active="guide">
      <h1 className="pt-4  mb-2 border-bottom">
        <div className="d-flex mb-2">
          <div className="flex-grow-1">User Guides</div>
        </div>
      </h1>
      <br />

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>General</Accordion.Header>
          <Accordion.Body>
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/YgN3R7pxaFE"
                title="YouTube video"
              ></iframe>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Booking</Accordion.Header>
          <Accordion.Body>
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/7heC5EtKrm8"
                title="YouTube video"
              ></iframe>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Settings - (Profiles/Types)</Accordion.Header>
          <Accordion.Body>
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/QoudtvAu0JQ"
                title="YouTube video"
              ></iframe>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Settings - (Movies)</Accordion.Header>
          <Accordion.Body>
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/BYCM1X2QkeM"
                title="YouTube video"
              ></iframe>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Settings - (Screens)</Accordion.Header>
          <Accordion.Body>
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/EsVJ-mWfUJY"
                title="YouTube video"
              ></iframe>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Settings - (Screenings)</Accordion.Header>
          <Accordion.Body>
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/sB5hose5q7w"
                title="YouTube video"
              ></iframe>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Layout>
  );
}

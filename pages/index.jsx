import Layout from "../components/layouts/anonymous";

import { Spinner, Card, Col, Row, Nav, Button } from "react-bootstrap";

// main app function
export default function Main() {
  return (
    <Layout title="Home" active="home">
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold">XL Cinema</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Quickly design and customize responsive mobile-first sites with
            Bootstrap, the world’s most popular front-end open source toolkit,
            featuring Sass variables and mixins, responsive grid system,
            extensive prebuilt components, and powerful JavaScript plugins.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button variant="dark" size="lg">Book Seats</Button>
            <Button variant="outline-dark" size="lg">Account</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

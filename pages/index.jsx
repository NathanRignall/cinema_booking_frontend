import Layout from "../components/layouts/anonymous";

import Link from "next/link";

import { Spinner, Card, Col, Row, Nav, Button } from "react-bootstrap";

// main app function
export default function Main() {
  return (
    <Layout title="Home" active="home">
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold">XL Cinema</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">Welcome to our online booking site!</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link href={`/movie`} passHref>
              <Button variant="dark" size="lg">
                Book Seats
              </Button>
            </Link>

            <Link href={`/account`} passHref>
              <Button variant="outline-dark" size="lg">
                Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import Layout from "../../../components/layouts/employee";

import useSWR from "swr";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { QrReader } from "react-qr-reader";

import { Spinner, Table, Col, Row, Nav, Button } from "react-bootstrap";

const Test = (props) => {
  const router = useRouter();

  const [data, setData] = useState("No result");

  useEffect(() => {
    if (data.length == 36) {
      router.push({
        pathname: "/admin/validate/[id]",
        query: { id: data },
      });
    }
  }, [data]);

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: "100%" }}
        constraints={{ facingMode: { exact: "environment" } }}
      />
    </>
  );
};

// main app function
export default function Main() {
  return (
    <Layout title="Validate" active="validate">
      <br />

      <h1 className="pt-2  mb-2 border-bottom">
        <div className="d-flex mb-2">
          <div className="flex-grow-1">Validate Ticket</div>
        </div>
      </h1>
      <br />

      <Test />
    </Layout>
  );
}

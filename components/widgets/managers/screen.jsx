import { useState, useEffect, forwardRef } from "react";
import useSWR, { mutate } from "swr";

import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import axios from "axios";

import { Form, Button, Spinner, Modal, Alert, Dropdown } from "react-bootstrap";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";

// form schemas
const schemaCreate = yup.object().shape({
  name: yup.string().required(),
  rows: yup.number().required().positive().integer(),
  columns: yup.number().required().positive().integer(),
});

// full create screen modal
export const ScreenCreateModal = (props) => {
  // contain the state of the modal
  const [show, setShow] = useState(false);

  // set the state of the modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // satus of the form requests
  const [serverState, setServerState] = useState({
    show: false,
    error: false,
    message: "none",
  });

  // set the server state from a response
  const handleServerResponse = (show, error, message) => {
    setServerState({ show, error, message });
  };

  // handle a from submit to create
  const handleOnSubmit = (values, actions) => {
    // create the json object to post
    const json = {
      name: values.name,
      rows: values.rows,
      columns: values.columns,
    };

    // axios post create
    axios
      .post(SCREEN_URI, json, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // set loading to false
        actions.setSubmitting(false);
        // set the server state to handle errors
        handleServerResponse(false, false, response.data.message);
        // reload the screen list
        mutate(SCREEN_URI);
        // close the modal
        handleClose();
      })
      .catch(function (error) {
        // catch each type of axios error
        if (error.response) {
          if (error.response.status == 500) {
            // check if a server error
            handleServerResponse(true, true, error.response.data.message);
          } else if (error.response.status == 502) {
            // check if api is offline
            handleServerResponse(true, true, "Error fetching api");
          } else {
            // check if a user error
            handleServerResponse(true, false, error.response.data.message);
          }
          actions.setSubmitting(false);
          // set loading to false
        } else if (error.request) {
          // check if a request error
          handleServerResponse(true, true, "Error sending request to server");
          actions.setSubmitting(false);
          // set loading to false
        } else {
          // check if a browser error
          handleServerResponse(true, true, "Error in browser request");
          actions.setSubmitting(false);
          // set loading to false
          console.log(error);
        }
      });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Screen
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="lg"
        centered={true}
        keyboard={false}
      >
        <Formik
          validationSchema={schemaCreate}
          initialValues={{
            title: "",
            description: "",
            duration: 0,
          }}
          onSubmit={handleOnSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Header className="bg-success text-white">
                <Modal.Title>Create Screen</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {/* name group */}
                <Form.Group controlId="validationFormik01">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={errors.name}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* rows group */}
                <Form.Group controlId="validationFormik03">
                  <Form.Control
                    type="text"
                    name="rows"
                    placeholder="Enter Rows"
                    value={values.rows}
                    onChange={handleChange}
                    isInvalid={errors.rows}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.rows}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* columns group */}
                <Form.Group controlId="validationFormik03">
                  <Form.Control
                    type="text"
                    name="columns"
                    placeholder="Enter Columns"
                    value={values.columns}
                    onChange={handleChange}
                    isInvalid={errors.columns}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.columns}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* display errors to the user */}
                {serverState.show && (
                  <Alert variant={!serverState.error ? "warning" : "danger"}>
                    {serverState.message}
                  </Alert>
                )}
              </Modal.Body>

              <Modal.Footer>
                {/* Close Modal button*/}
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>

                {/* Submit button*/}
                {isSubmitting ? (
                  <Button type="submit" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mr-2"
                    />
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit">Create</Button>
                )}
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

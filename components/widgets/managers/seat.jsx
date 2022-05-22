import { useState, useEffect } from "react";
import { mutate } from "swr";

import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import axios from "axios";

import { Form, Button, Spinner, Modal, Alert } from "react-bootstrap";

// axios request urls
const SEAT_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/seat";
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const TYPE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/type";

// form schemas
const schemaCreate = yup.object().shape({
  typeId: yup.string().required(),
  rows: yup.number().required().positive().integer(),
});

// type selector component
const TypeSelector = (props) => {
  // send details back to formik
  const { setFieldValue } = useFormikContext();

  // hold the current status
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [singleSelections, setSingleSelections] = useState([]);

  // if a single item is selected set the formik status
  useEffect(() => {
    if (singleSelections.length > 0) {
      setFieldValue(props.name, singleSelections[0].id);
    }
  }, [singleSelections]);

  // main feild searcher
  const handleSearch = (query) => {
    // make the axios request for search
    axios
      .get(`${TYPE_URI}/find?find=${query}`)
      .then((response) => {
        // put the response into array
        const options = response.data.payload.map((items) => ({
          name: items.name,
          id: items.id,
        }));
        // set the options state to this new array
        setOptions(options);
      })
      .catch((error) => {
        // catch each type of axios error
        if (error.response) {
          if (error.response.status == 400) {
            console.log("No results in search");
          } else {
            console.log("Error with response in search");
          }
        } else if (error.request) {
          console.log("No response in search");
        } else {
          console.log("Axios error in search");
        }
        // set options to itself
        setOptions(options);
      });
  };

  const filterBy = () => true;

  return (
    <AsyncTypeahead
      id={props.name}
      name={props.name}
      multiple={false}
      filterBy={filterBy}
      isLoading={isLoading}
      labelKey="name"
      minLength={2}
      onSearch={handleSearch}
      options={options}
      onChange={setSingleSelections}
      selected={singleSelections}
      placeholder="Enter Seat Type Name..."
      renderMenuItemChildren={(option, props) => <span>{option.name}</span>}
    />
  );
};

// full create bulk seats modal
export const SeatBulkCreateModal = (props) => {
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
      screenId: props.screen.id,
      typeId: values.typeId,
      rows: values.rows,
      columns: props.screen.columns,
    };

    // axios post create
    axios
      .post(`${SEAT_URI}/bulk`, json, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // set loading to false
        actions.setSubmitting(false);
        // set the server state to handle errors
        handleServerResponse(false, false, response.data.message);
        // reload the screen
        mutate(`${SCREEN_URI}/${props.screen.id}`);
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
        Bulk Add Seats
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
            typeId: "",
            rows: 0,
          }}
          onSubmit={handleOnSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Header className="bg-success text-white">
                <Modal.Title>Create Screen</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {/* type selector */}
                <Form.Group controlId="validationFormik01">
                  <TypeSelector name="typeId" />

                  {errors.moveId}
                </Form.Group>

                <br />

                {/* rows group */}
                <Form.Group controlId="validationFormik02">
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

                <div className="pt-2">
                  {/* display errors to the user */}
                  {serverState.show && (
                    <Alert variant={!serverState.error ? "warning" : "danger"}>
                      {serverState.message}
                    </Alert>
                  )}
                </div>
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

// full delete bulk modal
export function SeatBulkDeleteModal(props) {
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

  // handle delete
  const handleDelete = () => {
    // create the json object to post
    const json = {
      seatIds: props.seatIds,
    };

    // axios post create
    axios
      .post(`${SEAT_URI}/bulk/delete`, json, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // set the server state to handle errors
        handleServerResponse(false, false, response.data.message);
        // reload the screen
        mutate(`${SCREEN_URI}/${props.screenId}`);
        // close the modal
        handleClose();
        // clear selected
        props.clearSelected();
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
        } else if (error.request) {
          // check if a request error
          handleServerResponse(true, true, "Error sending request to server");
        } else {
          // check if a browser error
          handleServerResponse(true, true, "Error in browser request");
          console.log(error);
        }
      });
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow} disabled={props.disabled}>
        {props.seatIds.length == 0 ? (
          "Delete Selected Seats"
        ) : (
          <>
            {props.seatIds.length == 1
              ? `Delete ${props.seatIds.length} Seat`
              : `Delete ${props.seatIds.length} Seats`}
          </>
        )}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="md"
        centered={true}
        keyboard={false}
      >
        <Modal.Header className="bg-danger text-white">
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you would like to delete {props.seatIds.length} seats?
          <div className="pt-2">
            {/* display errors to the user */}
            {serverState.show && (
              <Alert variant={!serverState.error ? "warning" : "danger"}>
                {serverState.message}
              </Alert>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {/* Close Modal button*/}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          {/* Delete button*/}
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

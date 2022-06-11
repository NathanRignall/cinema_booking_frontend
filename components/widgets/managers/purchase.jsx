import { useState, useEffect } from "react";
import { mutate } from "swr";

import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import axios from "axios";

import { Form, Button, Spinner, Modal, Alert } from "react-bootstrap";

// axios request urls
const MOVIE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/movie";
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";
const PURCHASE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/purchase";
const TYPE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/type";
const PROFILE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/profile";

// create schema
const schemaCreate = yup.object().shape({
  profileId: yup.string().required(),
});

// profile selector component
const ProfileSelector = (props) => {
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
      .get(`${PROFILE_URI}/find?find=${query}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
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
      minLength={0}
      onSearch={handleSearch}
      options={options}
      onChange={setSingleSelections}
      selected={singleSelections}
      placeholder="Enter Profile Name..."
      renderMenuItemChildren={(option, props) => <span>{option.name}</span>}
    />
  );
};

// full purcahse crcreateease modal
export const PurchaseCreateModal = (props) => {
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
      paid: values.paid,
      screeningId: props.screeningId,
      seats: props.seatIds.map((id) => {
        return {
          id: id,
          profileId: values.profileId,
        };
      }),
    };

    // axios post create
    axios
      .post(PURCHASE_URI, json, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // set loading to false
        actions.setSubmitting(false);
        // set the server state to handle errors
        handleServerResponse(false, false, response.data.message);
        // reload the screening list
        mutate(`${SCREENING_URI}/${props.screeningId}`);
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
      <Button variant="outline-dark" onClick={handleShow} disabled={props.disabled}>
        Reserve Selected
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
            paid: true,
            profileId: "",
          }}
          onSubmit={handleOnSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Header className="bg-dark text-white">
                <Modal.Title>Reserve {props.seatIds.length} Seats</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {/* profile selector */}
                <Form.Group controlId="validationFormik01">
                  <ProfileSelector name="profileId" />

                  {errors.profileId}
                </Form.Group>

                <br />

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
                  <Button type="submit" variant="dark">Reserve</Button>
                )}
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

import { useState, useEffect } from "react";
import { mutate } from "swr";

import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import axios from "axios";

import { Form, Button, Spinner, Modal, Alert } from "react-bootstrap";

// axios request urls
const MOVIE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/movie";
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";

// form schema
const schemaCreate = yup.object().shape({
  movieId: yup.string().required("Select Movie"),
  screenId: yup.string().required("Select Screen"),
});

// movie selector component
const MovieSelector = (props) => {
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
      .get(`${MOVIE_URI}/find?title=${query}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // put the response into array
        const options = response.data.payload.map((items) => ({
          title: items.title,
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
      labelKey="title"
      minLength={2}
      onSearch={handleSearch}
      options={options}
      onChange={setSingleSelections}
      selected={singleSelections}
      placeholder="Enter Movie Name..."
      renderMenuItemChildren={(option, props) => <span>{option.title}</span>}
    />
  );
};

// screen selector component
const ScreenSelector = (props) => {
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
      .get(`${SCREEN_URI}/find?find=${query}`, {
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
      minLength={2}
      onSearch={handleSearch}
      options={options}
      onChange={setSingleSelections}
      selected={singleSelections}
      placeholder="Enter Screen Name..."
      renderMenuItemChildren={(option, props) => <span>{option.name}</span>}
    />
  );
};

// date selector
const DateSelector = ({ ...props }) => {
  // send details back to formik
  const { setFieldValue } = useFormikContext();

  // hold the current status
  const [field] = useField(props);

  // custom button to control date picker
  // const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  //   <Button variant="light" type="button" onClick={onClick} ref={ref}>
  //     {value ? value : "Set Date and Time"}
  //   </Button>
  // ));

  return (
    <DatePicker
      {...field}
      {...props}
      selected={field.value}
      dateFormat="MM/dd/yyyy HH:mm:ss"
      showTimeInput
      todayButton="Today"
      // customInput={<ExampleCustomInput />}
      onChange={(val) => {
        setFieldValue(field.name, val);
      }}
    />
  );
};

// full screening cue modal
export const ScreeningCreateModal = (props) => {
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
    console.log("go!");

    // create the json object to post
    const json = {
      time: values.time,
      price: 200,
      movieId: values.movieId,
      screenId: values.screenId,
    };

    // axios post create
    axios
      .post(SCREENING_URI, json, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // set loading to false
        actions.setSubmitting(false);
        // set the server state to handle errors
        handleServerResponse(false, false, response.data.message);
        // reload the screening list
        mutate(`${SCREENING_URI}?start=${props.startDate}&end=${props.endDate}`);
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
        Create Screening
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
            price: 0,
            moveId: "",
            screenId: "",
            time: new Date(),
          }}
          onSubmit={handleOnSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Header className="bg-success text-white">
                <Modal.Title>Create Screening</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {/* movie selector */}
                <Form.Group controlId="validationFormik01">
                  <MovieSelector name="movieId" />

                  {errors.movieId}
                </Form.Group>

                <br />

                {/* screen selector */}
                <Form.Group controlId="validationFormik02">
                  <ScreenSelector name="screenId" />

                  {errors.screenId}
                </Form.Group>

                <br />

                {/* screening time group */}
                <Form.Group controlId="validationFormik03">
                  <DateSelector name="time" />

                  {errors.time}
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

import { useRouter } from "next/router";
import React, { useState } from "react";

import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

import { Form, Button, Spinner, Alert } from "react-bootstrap";

// axios request urls
const SESSION_URI = process.env.NEXT_PUBLIC_API_URL + "/session";

// form schema
const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required("Password is required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

// main register form function
export default function RegisterForm(props) {
  // get the destination url
  const router = useRouter();
  let { destination_url } = router.query;

  if (destination_url == undefined) {
    destination_url = "/";
  }

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

  // handle a from submit to login
  const handleOnSubmit = (values, actions) => {
    // create the json object to post login
    const json = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    };

    // axios post login request
    axios
      .post(`${SESSION_URI}/register`, json, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // redirect back to the login page
        window.location.replace(destination_url);
        // set loading to false
        actions.setSubmitting(false);
        // set the server state to handle errors
        handleServerResponse(false, false, response.data.message);
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
    <Formik
      validationSchema={schema}
      onSubmit={handleOnSubmit}
      initialValues={{ email: "", password: "" }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          {/* firstName group */}
          <Form.Group
            controlId="validationFormik01"
            className="position-relative"
          >
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              value={values.firstName}
              onChange={handleChange}
              isInvalid={touched.firstName && errors.firstName}
              autoComplete="given-name"
              size="lg"
            />

            <Form.Control.Feedback tooltip type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>

          <br />

          {/* lastName group */}
          <Form.Group
            controlId="validationFormik01"
            className="position-relative"
          >
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              value={values.lastName}
              onChange={handleChange}
              isInvalid={touched.lastName && errors.lastName}
              autoComplete="family-name"
              size="lg"
            />

            <Form.Control.Feedback tooltip type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>

          <br />

          {/* email group */}
          <Form.Group
            controlId="validationFormik01"
            className="position-relative"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter Email"
              value={values.email}
              onChange={handleChange}
              isInvalid={touched.email && errors.email}
              autoComplete="email"
              size="lg"
            />

            <Form.Control.Feedback tooltip type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <br />

          {/* password group */}
          <Form.Group
            controlId="validationFormik02"
            className="position-relative"
          >
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter Password"
              value={values.password}
              onChange={handleChange}
              isInvalid={touched.password && errors.password}
              autoComplete="new-password"
              size="lg"
            />

            <Form.Control.Feedback tooltip type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <br />

          {/* password confirm group */}
          <Form.Group
            controlId="validationFormik02"
            className="position-relative"
          >
            <Form.Control
              type="password"
              name="passwordConfirmation"
              placeholder="Enter Password"
              value={values.passwordConfirmation}
              onChange={handleChange}
              isInvalid={
                touched.passwordConfirmation && errors.passwordConfirmation
              }
              autoComplete="new-password"
              size="lg"
            />

            <Form.Control.Feedback tooltip type="invalid">
              {errors.passwordConfirmation}
            </Form.Control.Feedback>
          </Form.Group>

          <br />

          {/* Submit button*/}
          {isSubmitting ? (
            <Button
              className="w-100"
              type="submit "
              size="lg"
              disabled
              variant="dark"
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </Button>
          ) : (
            <Button
              className="w-100"
              type="submit "
              size="lg"
              variant="dark"
            >
              Register
            </Button>
          )}

          <div style={{ minHeight: " 4.5rem", paddingTop: "10px" }}>
            {/* display errors to the user */}
            {serverState.show && (
              <Alert variant={!serverState.error ? "warning" : "danger"}>
                {serverState.message}
              </Alert>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}

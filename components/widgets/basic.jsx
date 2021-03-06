import { useState } from "react";

import { Spinner, Alert } from "react-bootstrap";

// basic loader spiral in the center of screen
export const Loader = (props) => (
  <div className="d-flex h-100 justify-content-center">
    <div className="my-auto">
      <Spinner animation="border" />.
    </div>
  </div>
);

// sticky error component
export const StickyError = (props) => {
  // contain the state of the error
  const [show, setShow] = useState(true);

  return (
    <div className="alert-fixed">
      <Alert
        show={show}
        variant={props.variant}
        onClose={() => setShow(false)}
        dismissible
      >
        {props.text}
      </Alert>
    </div>
  );
};

// inline error component
export const InlineError = (props) => (
  <div>
    <Alert variant={props.variant}>{props.text}</Alert>
  </div>
);

// main error displayer
export const ErrorDisplayer = (props) => {
  // save the error to var
  const error = props.error;

  // check there is acually an error
  if (error) {
    //TODO: add buttons to fix errors (login button)
    if (error.status == 401) {
      return <StickyError variant="danger" text="Need to login" />;
    } else if (error.status == 403) {
      return <StickyError variant="warning" text="Invalid permissions" />;
    } else if (error.status == 502) {
      return <StickyError variant="danger" text="Error fetching api" />;
    } else {
      if (error.hasOwnProperty("message")) {
        return <StickyError variant="danger" text={error.message} />;
      } else {
        return <StickyError variant="danger" text="Server error occured" />;
      }
    }
  } else {
    return "";
  }
};

// main error displayer
export const InlineErrorDisplayer = (props) => {
  // save the error to var
  const error = props.error;

  // check there is acually an error
  if (error) {
    //TODO: add buttons to fix errors (login button)
    if (error.status == 401) {
      return <InlineError variant="danger" text="Need to login" />;
    } else if (error.status == 403) {
      return <InlineError variant="warning" text="Invalid permissions" />;
    } else if (error.status == 502) {
      return <InlineError variant="danger" text="Error fetching api" />;
    } else {
      if (error.hasOwnProperty("message")) {
        return <InlineError variant="danger" text={error.message} />;
      } else {
        return <InlineError variant="danger" text="Server error occured" />;
      }
    }
  } else {
    return "";
  }
};

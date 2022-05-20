import Layout from "../../../components/layouts/default";

import React from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

import axios from "axios";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { Delete } from "../../../components/widgets/managers/shared";

import { Card, Spinner, Alert } from "react-bootstrap";

const ReactGridLayout = WidthProvider(RGL);

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const SEAT_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/seat";

class SeatLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.seats.map(function (item, key, list) {
        return {
          id: item.id,
          x: item.x,
          y: item.y,
          w: 1,
          h: 1,
          name: item.name,
        };
      }),
      layout: [],
      serverStateLayout: {
        show: false,
        error: false,
        message: "none",
      },
    };
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.seats !== this.props.seats) {
      // console.log(this.props.seats);

      this.setState({
        items: this.props.seats.map(function (item, key, list) {
          return {
            id: item.id,
            x: item.x,
            y: item.y,
            w: 1,
            h: 1,
            name: item.name,
          };
        }),
      });
    }
  }

  createElement(item) {
    return (
      <div key={item.id} data-grid={item}>
        {item.name}
      </div>
    );
  }

  onLayoutChange(layout) {
    this.setState({ layout });

    const json = {
      seats: [],
    };

    layout.map((item, key, list) => {
      let id = item.i;
      let x = item.x;
      let y = item.y;

      let previous = this.props.seats.find((seat) => seat.id === id);

      if (previous.x != x || previous.y != y) {
        json.seats.push({
          id: id,
          x: x,
          y: y,
        });
      }
    });

    // axios put request to save layout
    axios
      .put(`${SEAT_URI}/bulk`, json, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // set the server state to handle errors
        this.setState({
          serverStateLayout: {
            show: false,
            error: false,
            message: response.data.message,
          },
        });
        // reload
        mutate(`${SCREEN_URI}/${this.props.id}`);
        console.log(`${SCREEN_URI}/${props.id}`);
      })
      .catch((error) => {
        // catch each type of axios error
        if (error.response) {
          if (error.response.status == 500) {
            // check if a server error
            this.setState({
              serverStateLayout: {
                show: true,
                error: true,
                message: error.response.data.message,
              },
            });
          } else if (error.response.status == 502) {
            // check if api is offline
            this.setState({
              serverStateLayout: {
                show: true,
                error: true,
                message: "Error fetching api",
              },
            });
          } else {
            // check if a user error
            this.setState({
              serverStateLayout: {
                show: true,
                error: false,
                message: error.response.data.message,
              },
            });
          }
        } else if (error.request) {
          // check if a request error
          this.setState({
            serverStateLayout: {
              show: true,
              error: true,
              message: "Error sending request to server",
            },
          });
        } else {
          // check if a browser error
          this.setState({
            serverStateLayout: {
              show: true,
              error: true,
              message: "Error in browser request",
            },
          });
          console.log(error);
        }
      });
  }

  render() {
    return (
      <div>

        <ReactGridLayout
          className="layout"
          isDraggable={true}
          isResizable={false}
          compactType={null}
          containerPadding={[0, 0]}
          rowHeight={50}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          margin={[2, 2]}
          cols={this.props.columns}
        >
          {_.map(this.state.items, (item) => this.createElement(item))}
        </ReactGridLayout>
      </div>
    );
  }
}

// screening Card
const ScreenCard = (props) => {
  return (
    <>
      <Card>
        <Card.Header className="bg-secondary text-white">
          <h4 className="d-inline">{props.info.name}</h4>
        </Card.Header>

        <Card.Body>
          <SeatLayout {...props.info} />
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const Screen = (props) => {
  const { data, error } = useSWR(`${SCREEN_URI}/${props.id}`, fetcher);

  // check if data has loaded yet
  if (data) {
    return (
      <>
        <ErrorDisplayer error={error} />

        <ScreenCard info={data.payload} />
      </>
    );
  } else {
    return (
      <>
        <ErrorDisplayer error={error} />

        <div className="text-center">
          <Spinner animation="border" />
        </div>
      </>
    );
  }
};

// main app function
export default function Main() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title="Admin Screens ID">
      {id != undefined ? <Screen id={id} /> : null}
    </Layout>
  );
}

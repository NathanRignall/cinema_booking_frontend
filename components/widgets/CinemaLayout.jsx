import React from "react";
import useSWR, { mutate } from "swr";

import axios from "axios";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";

import { Card } from "react-bootstrap";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const SEAT_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/seat";

const ReactGridLayout = WidthProvider(RGL);

export default class CinemaLayout extends React.PureComponent {
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
          occupied: item.occupied,
          selected: false,
          color: item.type.color,
        };
      }),
      layout: [],
      selected: [],
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
      this.setState({
        items: this.props.seats.map(function (item, key, list) {
          return {
            id: item.id,
            x: item.x,
            y: item.y,
            w: 1,
            h: 1,
            name: item.name,
            occupied: item.occupied,
            selected: false,
            color: item.type.color,
          };
        }),
      });
    }
  }

  createElement(item) {
    const itemStyle = {
      backgroundColor: item.color,
    };

    return (
      <div
        key={item.id}
        data-grid={item}
        style={itemStyle}
        onClick={
          this.props.selectable ? this.selectSeat.bind(this, item.id) : null
        }
        className={item.selected ? "border border-primary border-4" : null}
      >
        {item.name}
        <br />
        {item.occupied ? "occupied" : null}
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

  selectSeat(seatId) {
    this.setState((state) => {
      const items = state.items.map((item) => {
        if (item.id == seatId) {
          let newItem = item;

          if (!newItem.selected & !newItem.occupied) {
            newItem.selected = true;
            return newItem;
          } else {
            newItem.selected = false;
            return newItem;
          }
        } else {
          return item;
        }
      });

      return {
        items,
      };
    });
  }

  render() {
    return (
      <div>
        <Card
          bg={"dark"}
          text={"white"}
          className="mb-5"
        >
          <Card.Header className="text-center">Screen</Card.Header>
        </Card>

        <ReactGridLayout
          className="layout"
          isDraggable={this.props.edit}
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

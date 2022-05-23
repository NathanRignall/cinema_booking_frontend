import React from "react";
import useSWR, { mutate } from "swr";

import axios from "axios";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";

import { PurchaseCreateModal } from "../managers/purchase";
import { SeatBulkDeleteModal } from "../managers/seat";

import { Card, Button } from "react-bootstrap";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const SEAT_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/seat";

const ReactGridLayout = WidthProvider(RGL);

export default class CinemaLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.screen.seats.map(function (item, key, list) {
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
      edit: false,
      selectable: this.props.selectable,
      serverStateLayout: {
        show: false,
        error: false,
        message: "none",
      },
    };
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.screen.seats !== this.props.screen.seats) {
      this.clearSelected();
      this.setState({
        items: this.props.screen.seats.map(function (item, key, list) {
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
          this.state.selectable ? this.selectSeat.bind(this, item.id) : null
        }
        className={`${
          item.selected & this.state.selectable
            ? "border border-primary border-4"
            : null
        } ${item.occupied ? "opacity-25" : null} d-flex justify-content-center`}
      >
        <div className="align-self-center text-bold">
          <b>{item.name}</b>
        </div>
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

      let previous = this.props.screen.seats.find((seat) => seat.id === id);

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
        mutate(`${SCREEN_URI}/${this.props.screen.id}`);
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
      const selected = [];

      const items = state.items.map((item) => {
        if (item.id == seatId) {
          let newItem = item;

          if (!newItem.selected & !newItem.occupied) {
            selected.push(seatId);

            newItem.selected = true;
            return newItem;
          } else {
            newItem.selected = false;
            return newItem;
          }
        } else {
          if (item.selected == true) {
            selected.push(item.id);
          }
          return item;
        }
      });

      return {
        items,
        selected,
      };
    });
  }

  clearSelected() {
    this.setState({ selected: [] });
  }

  toggleEdit() {
    if (this.props.edit) {
      if (this.state.edit) {
        this.setState({ edit: false, selectable: true });
      } else {
        this.setState({ edit: true, selectable: false });
      }
    }
  }

  render() {
    return (
      <div>
        <div className="d-flex pb-2 flex-row-reverse">
          {this.props.purchase ? (
            <div className="ms-2 d-inline">
              <PurchaseCreateModal
                screeningId={this.props.screeningId}
                seatIds={this.state.selected}
                disabled={this.state.selected.length == 0}
              />
            </div>
          ) : null}

          {this.props.edit ? (
            <div className="ms-2 d-inline">
              <Button
                variant={this.state.edit ? "success" : "primary"}
                onClick={this.toggleEdit}
              >
                {this.state.edit ? "Finished Editing" : "Edit Positions"}
              </Button>
            </div>
          ) : null}

          {!this.state.edit & this.props.edit ? (
            <div className="ms-2 d-inline">
              <SeatBulkDeleteModal
                screenId={this.props.screen.id}
                seatIds={this.state.selected}
                disabled={this.state.selected.length == 0}
                clearSelected={this.clearSelected}
              />
            </div>
          ) : null}
        </div>

        <Card bg={"dark"} text={"white"} className="mb-5">
          <Card.Header className="text-center">Screen</Card.Header>
        </Card>

        <div className="mt-2 pb-5">
          <ReactGridLayout
            className="layout"
            isDraggable={this.state.edit}
            isResizable={false}
            compactType={null}
            containerPadding={[0, 0]}
            rowHeight={50}
            layout={this.state.layout}
            onLayoutChange={this.onLayoutChange}
            margin={[2, 2]}
            cols={this.props.screen.columns}
          >
            {_.map(this.state.items, (item) => this.createElement(item))}
          </ReactGridLayout>
        </div>
      </div>
    );
  }
}

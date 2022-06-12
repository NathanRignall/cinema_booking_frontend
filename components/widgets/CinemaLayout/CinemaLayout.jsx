import React from "react";
import useSWR, { mutate } from "swr";

import axios from "axios";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";

import {
  PurchaseAdminCreateModal,
  PurchaseUserCreateModal,
} from "../managers/purchase";
import { SeatBulkDeleteModal } from "../managers/seat";

import { Card, Button, Modal } from "react-bootstrap";

// axios request urls
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";
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
          price: item.type.price,
          type: item.type.name,
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
      add: false,
      remove: false,
      current: {
        name: null,
        seatId: null,
        price: null,
        type: null,
      },
      basket: [],
      total: 0,
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
            price: item.type.price,
            type: item.type.name,
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
          this.state.selectable
            ? this.selectSeat.bind(this, item.id)
            : this.props.reservable
            ? this.actionSeat.bind(
                this,
                item.name,
                item.id,
                item.price,
                item.type
              )
            : null
        }
        className={`${item.selected ? " border-dark border-3" : null} ${
          item.occupied ? "opacity-25" : null
        } d-flex justify-content-center`}
      >
        <div className="align-self-center ">
          <small>{item.name}</small>
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

  actionSeat(name, seatId, price, type) {
    this.setState((state) => {
      let add = false;
      let remove = false;
      let current = {
        name: null,
        seatId: null,
        price: null,
        type: null,
      };

      state.items.map((item) => {
        if (item.id == seatId) {
          let newItem = item;
          current = {
            name: name,
            seatId: seatId,
            price: price,
            type: type,
          };

          if (!newItem.selected & !newItem.occupied) {
            add = true;
          } else {
            remove = true;
          }
        }
      });

      return {
        add,
        remove,
        current,
      };
    });
  }

  addBasketSeat(name, seatId, profile, profileId, price, type) {
    let add = false;

    this.setState((state) => {
      const selected = [];
      const basket = this.state.basket;

      const items = state.items.map((item) => {
        if (item.id == seatId) {
          let newItem = item;

          selected.push(seatId);
          basket.push({
            name: name,
            seatId: seatId,
            profile: profile,
            profileId: profileId,
            price: price,
            type: type,
          });

          newItem.selected = true;
          return newItem;
        } else {
          if (item.selected == true) {
            selected.push(item.id);
          }
          return item;
        }
      });

      let total = 0;

      this.state.basket.map((item) => {
        total = total + item.price;
      });

      return {
        add,
        items,
        selected,
        basket,
        total,
      };
    });
  }

  removeBasketSeat(seatId, profileId, price) {
    let add = false;

    console.log(seatId);

    this.setState((state) => {
      const selected = [];
      const basket = this.state.basket;

      const items = state.items.map((item) => {
        if (item.id == seatId) {
          let newItem = item;

          selected.push(seatId);
          basket.push({
            seatId: seatId,
            profileId: profileId,
            price: price,
          });

          newItem.selected = true;
          return newItem;
        } else {
          if (item.selected == true) {
            selected.push(item.id);
          }
          return item;
        }
      });

      return {
        add,
        items,
        selected,
      };
    });
  }

  clearSelected() {
    this.setState({ selected: [], total: 0, basket: [] });
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

  closeAddModal() {
    this.setState({
      add: false,
    });
  }

  closeRemoveModal() {
    this.setState({
      remove: false,
    });
  }

  render() {
    return (
      <div>
        {this.props.reservable ? (
          <>
            <Modal
              show={this.state.add}
              backdrop="static"
              size="md"
              centered={true}
              keyboard={false}
            >
              <Modal.Header className="bg-dark text-white">
                <Modal.Title>Choose Seat Type</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <h3 className=" mb-2 border-bottom">
                  Seat - {this.state.current.name}
                  <p className="lead mb-2">{this.state.current.type}</p>
                </h3>

                <br />

                {this.props.profiles.map((profile) => {
                  let price =
                    ((profile.price / 100) * this.state.current.price) / 100;

                  return (
                    <Button
                      key={price}
                      size="lg"
                      variant="outline-dark"
                      className="w-100 mb-2"
                      onClick={this.addBasketSeat.bind(
                        this,
                        this.state.current.name,
                        this.state.current.seatId,
                        profile.name,
                        profile.id,
                        price,
                        this.state.current.type,
                      )}
                    >
                      <div className="d-flex">
                        <div className="flex-grow-1 text-start">
                          {profile.name}
                        </div>
                        <div>£{price.toFixed(2)}</div>
                      </div>
                    </Button>
                  );
                })}
              </Modal.Body>

              <Modal.Footer>
                {/* Close Modal button*/}
                <Button
                  variant="secondary"
                  onClick={this.closeAddModal.bind(this)}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.remove}
              backdrop="static"
              size="lg"
              centered={true}
              keyboard={false}
            >
              <Modal.Header className="bg-dark text-white">
                <Modal.Title>Remove Seat</Modal.Title>
              </Modal.Header>

              <Modal.Body>Are you sure?</Modal.Body>

              <Modal.Footer>
                {/* Close Modal button*/}
                <Button
                  variant="secondary"
                  onClick={this.closeRemoveModal.bind(this)}
                >
                  Close
                </Button>

                <Button type="submit" variant="danger">
                  Remove
                </Button>
              </Modal.Footer>
            </Modal>{" "}
          </>
        ) : null}

        <div className="d-flex pb-2 flex-row-reverse">
          {this.props.purchase ? (
            <div className="ms-2 d-inline">
              <PurchaseAdminCreateModal
                screeningId={this.props.screeningId}
                seatIds={this.state.selected}
                disabled={this.state.selected.length == 0}
                mutate_url={`${SCREENING_URI}/${this.props.id}`}
              />
            </div>
          ) : null}

          {this.props.reservable ? (
            <div className="ms-2 d-inline">
              <PurchaseUserCreateModal
                screeningId={this.props.screeningId}
                basket={this.state.basket}
                total={this.state.total}
                disabled={this.state.selected.length == 0}
              >
                Checkout - £{this.state.total.toFixed(2)}
              </PurchaseUserCreateModal>
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

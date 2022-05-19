import Layout from "../../../components/layouts/default";

import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";
import { Delete } from "../../../components/widgets/managers/shared";

import { Card, Spinner, Alert } from "react-bootstrap";

import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import _ from "lodash";

const ReactGridLayout = WidthProvider(RGL);

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";

class SeatLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      items: this.props.seats.map(function (item, key, list) {
        return {
          id: item.id,
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          name: item.name,
        };
      }),
      layout: [],
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
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            name: item.name,
          };
        }),
      });
    }
  }

  createElement(item) {
    console.log(item);
    return (
      <div key={item.id} data-grid={item}>
        {item.name}
      </div>
    );
  }

  onLayoutChange(layout, layouts) {
    console.log(layouts);
    this.setState({ layout });
  }

  render() {
    return (
      <div >
        <ReactGridLayout
          className="layout"
          isDraggable={true}
          isResizable={false}
          containerPadding={[0, 0]}
          rowHeight={50}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          margin={[2,2]}
          cols={16}
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
          <SeatLayout seats={props.info.seats} />
        </Card.Body>
      </Card>
      <br />
    </>
  );
};

// main list loader
const Screen = (props) => {
  const { data, error } = useSWR(`${SCREENING_URI}/${props.id}`, fetcher);

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

import Layout from "../../../components/layouts/employee";

import { useState, useEffect } from "react";
import useSWR from "swr";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { enGB } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { fetcher } from "../../../components/common/functions";
import { ErrorDisplayer } from "../../../components/widgets/basic";

import { Form, Spinner } from "react-bootstrap";

// axios request urls
const SCREENING_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screening";
const MOVIE_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/movie";
const SCREEN_URI = process.env.NEXT_PUBLIC_API_URL + "/admin/screen";

// movie selector component
const MovieSelector = (props) => {
  // hold the current status
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [singleSelections, setSingleSelections] = useState([]);

  // if a single item is selected set the formik status
  useEffect(() => {
    if (singleSelections.length > 0) {
      console.log(singleSelections);
    }
  }, [singleSelections]);

  // main feild searcher
  const handleSearch = (query) => {
    // make the axios request for search
    axios
      .get(`${MOVIE_URI}/find?find=${query}`, {
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
      multiple={true}
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
  // hold the current status
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [singleSelections, setSingleSelections] = useState([]);

  // if a single item is selected set the formik status
  useEffect(() => {
    if (singleSelections.length > 0) {
      console.log(singleSelections);
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
      multiple={true}
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

const data2 = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Dataset 1",
      data: [2, 5, 7, 3, 8, 5, 9],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [4, 6, 2, 3, 5, 2, 1],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const options = {
  scales: {
    y: {
      title: { display: true, text: "Weight in lbs" },
    },
    x: {
      adapters: {
        date: { locale: enGB },
        type: "time",
        distribution: "linear",
        time: {
          parser: "yyyy-mm-dd",
          unit: "month",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  },
};

// test loader
const StatsTest = (props) => {
  const { data, error } = useSWR(
    `${SCREENING_URI}/stats?occupied=true`,
    fetcher
  );

  // check if data has loaded yet
  if (data) {

    const chat_data = {
        datasets: [
          {
            label: "Seats Filled",
            data: data.payload.map((record) => {
              return {
                x: record.date,
                y: record.occupiedSeats
              }
            }),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          }
        ]
    }

    console.log(chat_data);

    return (
      <>
        <MovieSelector name="movieId" />
        <ScreenSelector name="screenId" />
        <Line options={options} data={chat_data} />
        <ErrorDisplayer error={error} />
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
  return (
    <Layout title="Stats Test" active="statistics">
      <h1 className="pt-4 mb-2 border-bottom">Statistics</h1>

      <br />
      <StatsTest />
    </Layout>
  );
}

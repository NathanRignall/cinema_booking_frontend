import Layout from "../../../components/layouts/employee";

import { useState, useEffect } from "react";
import useSWR from "swr";

import { Formik, useField, useFormikContext } from "formik";
import * as yup from "yup";
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
import { enGB } from "date-fns/locale";

import { Form, Button, Spinner, Modal, Alert } from "react-bootstrap";

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
    props.set(singleSelections);
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
    props.set(singleSelections);
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

const options = {
  scales: {
    y: {
      title: { display: true, text: "Seats Filled" },
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

const screenDecode = (data, name) => {
  const array = [];

  data.map((record) => {
    if (record.screen.name == name) {
      array.push({
        x: record.date,
        y: record.count,
      });
    }
  });

  return array;
};

const movieDecode = (data, title) => {
  const array = [];

  data.map((record) => {
    if (record.movie.title == title) {
      array.push({
        x: record.date,
        y: record.count,
      });
    }
  });

  return array;
};

//
const MainGraph = (props) => {
  const { data, error } = useSWR(
    `${SCREENING_URI}/stats?occupied=true${props.query}`,
    fetcher
  );

  // check if data has loaded yet
  if (data) {
    const datasets = [];

    if (props.screenSelections.length > 1 && props.movieSelections.length > 1) {
      
    }

    if (props.screenSelections.length > 1) {
      props.screenSelections.map((item) => {
        console.log(item);
        datasets.push({
          label: item.name,
          data: screenDecode(data.payload, item.name),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        });
      });
    } else if (props.screenSelections.length == 1){
      datasets.push({
        label: props.screenSelections[0].name,
        data: data.payload.map((record) => {
          return {
            x: record.date,
            y: record.count,
          };
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      });
    }

    if (props.movieSelections.length > 1) {
      props.movieSelections.map((item) => {
        datasets.push({
          label: item.title,
          data: movieDecode(data.payload, item.title),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        });
      });
    } else if (props.movieSelections.length == 1 & props.screenSelections.length == 0) {
      datasets.push({
        label: props.movieSelections[0].title,
        data: data.payload.map((record) => {
          return {
            x: record.date,
            y: record.count,
          };
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      });
    }

    const chat_data = {
      // datasets: [
      //   {
      //     label: "Seats Filled",
      //     data: data.payload.map((record) => {
      //       return {
      //         x: record.date,
      //         y: record.count,
      //       };
      //     }),
      //     borderColor: "rgb(53, 162, 235)",
      //     backgroundColor: "rgba(53, 162, 235, 0.5)",
      //   },
      // ],
      datasets: datasets,
    };

    return (
      <>
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

// test loader
const StatsTest = (props) => {
  const [movieSelections, setMovieSelections] = useState([]);
  const [screenSelections, setScreenSelections] = useState([]);

  const [query, setQuery] = useState("");

  useEffect(() => {
    let query1 = "";
    movieSelections.map((item) => {
      query1 = `${query1}&movieId=${item.id}`;
    });

    console.log(query1);

    let query2 = "";
    screenSelections.map((item) => {
      query2 = `${query2}&screenId=${item.id}`;
    });

    console.log(query2);

    setQuery(query1 + query2);
  }, [movieSelections, screenSelections]);

  useEffect(() => {
    console.log(query);
  }, [query]);

  return (
    <>
      <MovieSelector set={setMovieSelections} name="movieId" />

      <br />

      <ScreenSelector set={setScreenSelections} name="screenId" />

      <br />

      <MainGraph
        query={query}
        movieSelections={movieSelections}
        screenSelections={screenSelections}
      />
    </>
  );
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

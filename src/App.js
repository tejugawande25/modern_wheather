import Chart from "chart.js/auto";
import React, { useEffect } from "react";
import "./App.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cloudImage from "./images/cloud.png";
import rainImage from "./images/rain.png";
import windImage from "./images/wind.png";
import humidityImage from "./images/humidity.png";
import visibiltyImage from "./images/visibility.png";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import GaugeChart from "react-gauge-chart";
import ClearSky from "./images/clear-sky.png";
import MostlyCloudly from "./images/mostly-cloudly.png";
import WhispyCloud from "./images/whispy-cloud.png";

function App() {
  const [city, setCity] = useState("mumbai");
  const [tempDegree, setTempDegree] = useState("celcius");
  const [temp, setTemp] = useState({});
  const [history, setHistory] = useState([10, 20, 30, 32, 42, 50, 35]);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date().getDay();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();

  const url = `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=55InEdnuVku4wIpY4vnL6GHZoJsNuPFA`;

  const forecasturl = `https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=55InEdnuVku4wIpY4vnL6GHZoJsNuPFA`;

  const fetchForecast = async (event) => {
    try {
      const forecastResponse = await axios.get(url);
      setTemp(forecastResponse.data);
    } catch (error) {
      console.log(error);
      toast.error("Rate limit exceeds! Try after some time.");
      return error.message;
    }
  };

  const fetchHistory = async (event) => {
    try {
      const historyResponce = await axios.get(forecasturl);
      console.log(historyResponce);
      console.log(historyResponce.data.timelines.daily.map((timeline, i) => {
        return timeline.values["temperatureAverage"];
      }));
      setHistory(historyResponce.data.timelines.daily.map((timeline, i) => {
        console.log(timeline);
        return timeline.values["temperatureAvg"];
      }));
    } catch (error) {
      console.log(error);
      toast.error("Rate limit exceeds! Try after some time.");
      return error.message;
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchForecast();

  }, []);

  const degreeTemp = Number(temp?.data?.values?.temperature) + "°C";

  const fahrenheitTemp =
    Number(temp?.data?.values?.temperature * (9 / 5) + 32) + "°F";

  const uvValue = Number(temp?.data?.values?.uvIndex / 100);

  const cloudInformation = () => {
    if (
      temp?.data?.values?.cloudCover >= 0 &&
      temp?.data?.values?.cloudCover <= 25
    ) {
      return "Clear Sky";
    } else if (
      temp?.data?.values?.cloudCover >= 25 &&
      temp?.data?.values?.cloudCover <= 50
    ) {
      return "Whispy Clouds";
    } else {
      return "Mostly Cloudly";
    }
  };

  const imageSource =
    temp?.data?.values?.cloudCover >= 0 && temp?.data?.values?.cloudCover <= 25
      ? ClearSky
      : temp?.data?.values?.cloudCover >= 25 &&
        temp?.data?.values?.cloudCover <= 50
      ? WhispyCloud
      : MostlyCloudly;

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="container">
        <div className="main-container">
          <div className="left-container">
            <div className="input-container">
              <FontAwesomeIcon
                className="search-icon"
                icon={faMagnifyingGlass}
              />
              <input
                className="city-input"
                value={city}
                type="search"
                placeholder="Search for places ..."
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchForecast();
                }}
              />
            </div>
            <div className="image-container">
              <img className="cloud-image" src={imageSource} />
            </div>
            <div className="temperature">
              <div className="degree-container">
                <p className="degree-temperature">
                  {temp
                    ? tempDegree === "celcius"
                      ? degreeTemp
                      : fahrenheitTemp
                    : "25"}
                </p>
              </div>
              <div className="temperature-day-time">
                <p className="temperature-day">{days[today]}</p>
                <p className="temperature-time">
                  {hour < 10 ? "0" + hour : hour}:
                  {minute < 10 ? "0" + minute : minute}
                </p>
              </div>
              <div
                style={{
                  height: "20px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ width: "70%", borderTop: "1px solid gray" }}
                ></div>
              </div>
            </div>
            <div className="basic-info">
              <div className="basic-info-upper">
                <img className="basic-info-image" src={cloudImage} />
                <p>{cloudInformation()}</p>
              </div>
              <div className="basic-info-lower">
                <img className="basic-info-image" src={rainImage} />
                <p>Rain-{temp?.data?.values?.rainIntensity * 10}%</p>
              </div>
            </div>
            <div className="lower-image">
              <img
                style={{ height: "100%", width: "100%" }}
                src="https://cdn.pixabay.com/photo/2022/11/07/20/23/new-york-7577186_640.jpg"
              />
            </div>
          </div>
          <div className="right-container">
            <div className="right-container-upper">
              <div className="day-container">
                <p style={{ fontSize: "28px", marginLeft: "30px" }}>
                  {days[today]}
                </p>
              </div>
              <div className="degree-temp">
                <button
                  onClick={() => setTempDegree("celcius")}
                  className="degree-button"
                  style={{ background: "black", color: "white" }}
                >
                  °C
                </button>
                <button
                  className="degree-button"
                  style={{ background: "white", color: "black" }}
                  onClick={() => setTempDegree("farenheit")}
                >
                  °F
                </button>
                <div className="profile-container">
                  <img
                    style={{ height: "100%", width: "100%" }}
                    src="https://media.istockphoto.com/id/1369508766/photo/beautiful-successful-latin-woman-smiling.jpg?s=612x612&w=0&k=20&c=LoznG6eGT42_rs9G1dOLumOTlAveLpuOi_U755l_fqI="
                  />
                </div>
              </div>
            </div>
            <div
              className="chart"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Line
                width={700}
                height={200}
                options={{
                  responsive: false,
                }}
                style={{ cursor: "pointer" }}
                data={{
                  labels: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  datasets: [
                    {
                      label: "Temperature of Week",
                      data: history,
                    },
                  ],
                }}
              />
            </div>
            <div className="today-highlight">
              <p
                style={{
                  fontSize: "18px",
                  margin: "0",
                  fontWeight: "500",
                  marginLeft: "28px",
                  marginTop: "10px",
                }}
              >
                Today's Highlights
              </p>
            </div>
            <div className="info-container">
              <div className="wind-card">
                <p>Wind Status</p>
                <p style={{ margin: "0", fontSize: "28px" }}>
                  {temp ? temp?.data?.values?.windGust : "5.5"}Km/h
                </p>
                <img
                  src={windImage}
                  style={{ height: "100px", width: "60%" }}
                />
              </div>
              <div className="humidity-card">
                <p>Humidity</p>
                <p style={{ margin: "0", fontSize: "28px" }}>
                  {temp ? temp?.data?.values?.humidity : "15"}%
                </p>
                <img
                  src={humidityImage}
                  style={{ height: "80px", width: "50%", marginTop: "5px" }}
                />
              </div>
              <div className="visibility-card">
                <p>Visibility</p>
                <p style={{ margin: "0", fontSize: "28px" }}>
                  {temp ? temp?.data?.values?.visibility : "20"}Km
                </p>
                <img
                  src={visibiltyImage}
                  style={{ height: "100px", width: "65%", marginTop: "5px" }}
                />
              </div>
              <div className="air-quality-card">
                <p>UV Index</p>{" "}
                <p
                  style={{
                    margin: "0",
                    fontSize: "28px",
                    marginBottom: "10px",
                  }}
                >
                  {temp ? temp?.data?.values?.uvIndex : "10"}W/m<sup>2</sup>
                </p>
                <GaugeChart
                  id="gauge-chart2"
                  nrOfLevels={20}
                  percent={uvValue}
                  hideText={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

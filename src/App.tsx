import { useState } from "react";
import useWebSocket from "react-use-websocket";

import "./App.css";
import { JsonMessage } from "./types";
import PlayIcon from "./icons/PlayIcon";
import PauseIcon from "./icons/PauseIcon";

const WEBSOCKET_URL = "ws://localhost:8765/data";
const TEMPLATE = [
  ["A1", "B1", "C1", "D1", "E1", "F1"],
  ["A2", "B2", "C2", "D2", "E2", "F2"],
  ["A3", "B3", "C3", "D3", "E3", "F3"],
  ["A4", "B4", "C4", "D4", "E4", "F4"],
];
const ROW_LETTERS = ["A", "B", "C", "D", "E", "F"];
const COLUMN_NUMBERS = [1, 2, 3, 4];
// TODO check and adjust this
const MIN_DATE_TIME = "2022-01-04T00:00";
const MAX_DATE_TIME = new Date().toISOString().split(".")[0];

function App() {
  const { lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
    shouldReconnect: () => true,
  });

  // const usage: number[][] = isPlaying ? (lastJsonMessage
  //   ? (lastJsonMessage as JsonMessage).grid
  //   : [
  //       [0, 0, 0, 0, 0, 0],
  //       [0, 0, 0, 0, 0, 0],
  //       [0, 0, 0, 0, 0, 0],
  //       [0, 0, 0, 0, 0, 0],
  //     ]) : actualUsage ? ;

  const frame = lastJsonMessage
    ? `data:image/png;base64, ${(lastJsonMessage as JsonMessage).frame}`
    : "/assets/temp-img.png";

  let usage: number[][] = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];

  const [actualUsage, setActualUsage] = useState(usage);
  const [startTime, setStartTime] = useState("2024-01-04T11:11");
  const [endTime, setEndTime] = useState("2024-01-04T11:20");
  const [isPlaying, setIsPlaying] = useState(true);

  if (isPlaying) {
    if (lastJsonMessage) {
      usage = (lastJsonMessage as JsonMessage).grid;
    }
  } else if (actualUsage) {
    usage = actualUsage;
  }

  const getAggregateData = () => {
    setIsPlaying(false);
    const startTimeStamp = new Date(startTime).getTime().toString();
    const endTimeStamp = new Date(endTime).getTime().toString();

    // TODO get the aggregate with a call like this

    async function getAggregate(time1: string, time2: string) {
      try {
        const response = await fetch(
          `http://localhost:8766/aggregate/${time1}/${time2}`
        );
        const responseJson = await response.json();
        setActualUsage(responseJson.grid);
      } catch (error) {
        console.log(error.message);
      }
    }

    getAggregate(startTimeStamp, endTimeStamp);
  };

  const start = () => {
    fetch("http://localhost:8766/start", { method: "POST" })
      .then(() => setIsPlaying(true))
      .catch((err) => console.log(err));
  };

  const stop = () => {
    fetch("http://localhost:8766/stop", { method: "POST" })
      .then(() => setIsPlaying(false))
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //   if (isPlaying) {
  //     setStartTime("");
  //     setEndTime("");
  //     // TODO start the websocket
  //   } else {
  //     // TODO stop the websocket here
  //   }
  // }, [isPlaying]);

  return (
    <div className="panels">
      <div className="half-panel">
        <h2>Video</h2>
        <img src={frame} alt="video" style={{ maxWidth: 800 }} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className={isPlaying ? "inActiveButton" : "activeButton"}
            onClick={stop}
          >
            <PauseIcon />
          </button>
          <button
            className={isPlaying ? "activeButton" : "inActiveButton"}
            onClick={start}
          >
            <PlayIcon />
          </button>
        </div>
      </div>
      <div className="half-panel">
        <h2>Dwell Time Heat Map</h2>

        <div
          id="board"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "row", marginLeft: 40 }}
          >
            {ROW_LETTERS.map((letter) => (
              <div
                className="titleCell"
                role="cell"
                key={letter}
                style={{ width: 100, height: 50, margin: 2 }}
              >
                {letter}
              </div>
            ))}
          </div>

          {usage.map((row, rowIndex) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
                key={`${rowIndex}-row`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 16,
                    maxWidth: 8,
                  }}
                >
                  {COLUMN_NUMBERS[rowIndex]}
                </div>
                {row.map((cell, cellIndex) => {
                  const cellOpacity = cell < 5 ? 0.05 : cell / 100;
                  return (
                    <div
                      style={{
                        backgroundColor: "#5AC8FA",
                        opacity: cellOpacity,
                      }}
                      className="cell"
                      role="cell"
                      key={TEMPLATE[rowIndex][cellIndex]}
                    >
                      {/* {`-- ${rowIndex}:${cellIndex} -- ${cell}%`} */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div
          style={{
            margin: 44,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", minWidth: 250 }}
          >
            <label>Start Time</label>
            <input
              aria-label="Date and time from"
              max={endTime || MAX_DATE_TIME}
              min={MIN_DATE_TIME}
              value={startTime}
              type="datetime-local"
              onChange={(event) => {
                return setStartTime(event.target.value);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: 250,
              marginLeft: 32,
            }}
          >
            <label>End Time</label>
            <input
              aria-label="Date and time to"
              max={MAX_DATE_TIME}
              min={startTime || MIN_DATE_TIME}
              value={endTime}
              type="datetime-local"
              onChange={(event) => {
                return setEndTime(event.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            aria-label="Get Aggregate Data"
            onClick={getAggregateData}
            className="aggregateButton"
            disabled={startTime === "" || endTime === ""}
          >
            Get Aggregate Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

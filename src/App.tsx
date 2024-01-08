import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

import "./App.css";
import { JsonMessage } from "./types";
import PlayIcon from "./icons/PlayIcon";
import PauseIcon from "./icons/PauseIcon";

// generated with https://maketintsandshades.com/#5AC8FA
const COLORS = [
  "#ffffff",
  "#effaff",
  "#def4fe",
  "#ceeffe",
  "#bde9fd",
  "#ade4fd",
  "#9cdefc",
  "#8cd9fc",
  "#7bd3fb",
  "#6bcefb",
  "#5ac8fa",
];
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
const MIN_DATE_TIME = "2022-01-05T00:00";
const MAX_DATE_TIME = new Date().toISOString().split(".")[0];

function App() {
  const { lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
    shouldReconnect: () => true,
  });

  const usage: number[][] = lastJsonMessage
    ? (lastJsonMessage as JsonMessage).grid
    : [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];

  const frame = lastJsonMessage
    ? `data:image/png;base64, ${(lastJsonMessage as JsonMessage).frame}`
    : "/assets/temp-img.png";

  // const [actualUsage, setActualUsage] = useState(usage);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const getAggregateData = () => {
    setIsPlaying(false);
    const startTimeStamp = new Date(startTime).getTime();
    const endTimeStamp = new Date(endTime).getTime();
    console.log("🚀 getAggregateData ~ startTime:", startTime, startTimeStamp);
    console.log("🚀  getAggregateData ~ endTime:", endTime, endTimeStamp);

    // TODO get the aggregate with a call like this

    //   async function getAggregate(time1: string, time2: string) {
    //     await getAggregateAPICall
    //       .then((resp: Response) => {
    //         setActualUsage(resp.data);
    //       })
    //       .catch((error: Error) => {
    //         console.log(error.message);
    //       });
    //   }

    //   getAggregate(startTimeStamp, endTimeStamp);
  };

  useEffect(() => {
    if (isPlaying) {
      setStartTime("");
      setEndTime("");
      // TODO start the websocket
    } else {
      // TODO stop the websocket here
    }
  }, [isPlaying]);

  return (
    <div className="panels">
      <div className="half-panel">
        <h2>Video</h2>
        <img src={frame} alt="video" style={{ maxWidth: 800 }} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className={isPlaying ? "inActiveButton" : "activeButton"}
            onClick={() => setIsPlaying(false)}
          >
            <PauseIcon />
          </button>
          <button
            className={isPlaying ? "activeButton" : "inActiveButton"}
            onClick={() => setIsPlaying(true)}
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
                  return (
                    <div
                      style={{
                        backgroundColor: COLORS[Math.floor(cell / 10)],
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

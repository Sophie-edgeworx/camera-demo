import useWebSocket from "react-use-websocket";

import "./App.css";

const WEBSOCKET_URL = "ws://localhost:8765/data";
const TEMPLATE = [
  ["A1", "B1", "C1", "D1", "E1", "F1"],
  ["A2", "B2", "C2", "D2", "E2", "F2"],
  ["A3", "B3", "C3", "D3", "E3", "F3"],
  ["A4", "B4", "C4", "D4", "E4", "F4"],
];
const ROW_LETTERS = ["A", "B", "C", "D", "E", "F"];
const COLUMN_NUMBERS = [1, 2, 3, 4];

function App() {
  const { lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
    shouldReconnect: () => true,
  });

  const usage = (lastJsonMessage && lastJsonMessage.grid) || [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  const frame = lastJsonMessage ? `data:image/png;base64, ${lastJsonMessage.frame}` : "/assets/temp-img.png";

  return (
    <div className="panels">
      <div className="half-panel">
        <h2>Video</h2>
        <img src={frame} alt="video" style={{ maxWidth: 800 }} />
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
                className="cell"
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
                        width: 100,
                        height: 100,
                        margin: 2,
                        backgroundColor: "#0A415E",
                        opacity: cell / 100,
                      }}
                      role="cell"
                      key={TEMPLATE[rowIndex][cellIndex]}
                    >
                      {/* {`${template[rowIndex][cellIndex]}: ${cell}%`} */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

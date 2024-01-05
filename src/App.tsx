import "./App.css";

function App() {
  const template = [
    ["A1", "B1", "C1", "D1", "E1", "F1"],
    ["A2", "B2", "C2", "D2", "E2", "F2"],
    ["A3", "B3", "C3", "D3", "E3", "F3"],
    ["A4", "B4", "C4", "D4", "E4", "F4"],
  ];

  const usage = [
    [50, 5, 10, 15, 20, 25],
    [30, 35, 40, 45, 50, 55],
    [60, 65, 70, 75, 80, 85],
    [90, 95, 100, 75, 50, 25],
  ];

  const rowLetters = ["A", "B", "C", "D", "E", "F"];
  const columnNumbers = [1, 2, 3, 4];

  return (
    <div className="panels">
      <div className="half-panel">
        <h2>Video</h2>
        <img src="/assets/temp-img.png" alt="video" style={{ maxWidth: 800 }} />
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
            {rowLetters.map((letter) => (
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
                  {columnNumbers[rowIndex]}
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
                      key={template[rowIndex][cellIndex]}
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

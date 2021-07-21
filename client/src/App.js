import React from "react";
import "./App.css";
import BubbleChart from "./components/BubbleChart";
const axios = require("axios").default;

function App() {
  // Create state variables
  let [responseData, setResponseData] = React.useState("");
  axios
    .get("/api/test")
    .then(async ({ data: { message } }) => {
      setResponseData(message);
      console.log(message);
    })
    .catch((err) => console.log(err));

  return (
    <div className="App">
      <header className="App-header">
        <div>{responseData}</div>
        <BubbleChart />
      </header>
    </div>
  );
}

export default App;

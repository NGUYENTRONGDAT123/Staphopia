import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { BubbleChart } from "./BubbleChart/BubbleChart";
import data2 from "./TestingData/data2";
import { Navigation } from "./Components/NavBar.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          {/* Home page */}
          <Route exact path="/" />
          <Route path="/AMR">
            <BubbleChart width="400" height="400" data={data2} />
          </Route>
          {/* </Router> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;

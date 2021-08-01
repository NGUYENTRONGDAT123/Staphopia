import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { BubbleChart } from "./BubbleChart/BubbleChart";
import data2 from "./TestingData/data2";
import { Navigation } from "./Components/NavBar.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          {/* <Router>
          <div>
            <nav>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/chart">Bubble Chart</Link>
              </li>
            </nav>
          </div> */}

          {/* Home page */}
          <Route path="/" />
          <Route path="/chart">
            <BubbleChart width="400" height="400" data={data2} />
          </Route>
          {/* </Router> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;

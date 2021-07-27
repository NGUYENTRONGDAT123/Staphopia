import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { BubbleChart } from "./BubbleChart/BubbleChart";
import data from "./TestingData/data1";

function App() {
  // useEffect(() => {
  //   const width = 400;
  //   const height = 400;
  //   const data = [10, 28, 35];
  //   const colors = ["green", "lightblue", "yellow"];

  //   const svg = d3
  //     .select("body")
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height);

  //   const g = svg
  //     .selectAll("g")
  //     .data(data)
  //     .enter()
  //     .append("g")
  //     .attr("transform", function (d, i) {
  //       return "translate(0,0)";
  //     });

  //   g.append("circle")
  //     .attr("cx", function (d, i) {
  //       return i * 75 + 50;
  //     })
  //     .attr("cy", function (d, i) {
  //       return 75;
  //     })
  //     .attr("r", function (d) {
  //       return d * 1.5;
  //     })
  //     .attr("fill", function (d, i) {
  //       return colors[i];
  //     });

  //   g.append("text")
  //     .attr("x", function (d, i) {
  //       return i * 75 + 25;
  //     })
  //     .attr("y", 80)
  //     .attr("stroke", "teal")
  //     .attr("font-size", "10px")
  //     .attr("font-family", "sans-serif")
  //     .text((d) => {
  //       return d;
  //     });
  // }, []);

  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chart">Bubble Chart</Link>
            </li>
          </nav>
        </div>
        <Route path="/" />
        <Route path="/chart">
          <BubbleChart width="400" height="400" data={data} />
        </Route>
      </Router>
    </div>
  );
}

export default App;

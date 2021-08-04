import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navigation } from "./Components/NavBar.js";
import { Home } from "./Pages/Home/Home";
import { AMRPage } from "./Pages/AMR/AMRPage.js";

function App() {
  return (
    // <div className="App">
    //   <Router>
    //     <Navigation />
    //     <Switch>
    //       {/* Home page */}
    //       <Route exact path="/" />
    //       <Route path="/AMR">
    //         <BubbleChart width="400" height="400" data={data2} />
    //       </Route>
    //       {/* </Router> */}
    //     </Switch>
    //   </Router>
    // </div>

    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          {/* Home page */}
          <Route exact path="/" component={Home} />
          <Route path="/AMR" component={AMRPage} />

          {/* </Router> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;

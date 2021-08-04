import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { Layout } from "antd";
import HomePage from "./pages/HomePage";
import AMRPage from "./pages/AMRPage/AMRPage";
const { Footer, Content } = Layout;

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

    <Layout>
      <Layout>
        <Content>
          <Router>
            <NavBar />
            <Switch>
              {/* Home page */}
              <Route exact path="/" component={HomePage} />
              <Route path="/AMR" component={AMRPage} />
              {/* </Router> */}
            </Switch>
          </Router>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>WebScape Team</Footer>
    </Layout>
  );
}

export default App;

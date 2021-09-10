import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NavBar from "./components/navbar";
import { Layout, Menu } from "antd";
import HomePage from "./pages/HomePage/HomePage";
import AMRPage from "./pages/AMRPage/AMRPage";
import { Header } from "antd/lib/layout/layout";
import Iframe from "react-iframe";
const { Footer, Content } = Layout;
const axios = require("axios").default;

function App() {
  // const url = "localhost:3001";
  // fetch(url)
  //   .then(function (response) {
  //     // The API call was successful!
  //     return response.text();
  //   })
  //   .then(function (html) {
  //     // This is the HTML from our response as a text string
  //     console.log(html);
  //   })
  //   .catch(function (err) {
  //     // There was an error
  //     console.warn("Something went wrong.", err);
  //   });

  const html = "Hello";
  console.log(html);

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
    //

    // <Layout>
    //   <Header className="header">
    //     <NavBar />
    //   </Header>
    //   <Content>
    //     <Router>
    //       <Switch>
    //         {/* Home page */}
    //         <Route exact path="/" component={HomePage} />
    //         <Route path="/AMR" component={AMRPage} />
    //         {/* </Router> */}
    //       </Switch>
    //     </Router>
    //   </Content>

    //   <Footer style={{textAlign: 'center'}}>WebScape Team</Footer>
    // </Layout>

    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <span>Home</span>
              <Link to="/" />
            </Menu.Item>
            <Menu.Item key="2">
              <span>AMR</span>
              <Link to="/AMR" />
            </Menu.Item>
          </Menu>
        </Header>
        <Content
          style={{
            margin: "8px 8px",
            background: "#fff",
            minHeight: 280,
          }}
        >
          <Route exact path="/" component={HomePage} />
          <Route path="/AMR" component={AMRPage} />
        </Content>
        <Footer style={{ textAlign: "center", margin: "0px 0px 0px 0px" }}>
          WebScape Team ©2021 StaphBook
        </Footer>
      </Layout>
    </Router>
    // <Iframe
    //   url="http://127.0.0.1:3001"
    //   position="absolute"
    //   width="100%"
    //   height="100%"
    //   sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation allow-downloads"
    // />
  );
}

export default App;

//<iframe frameborder="0" id="IFRAME_ID" src="http://127.0.0.1:3001" />

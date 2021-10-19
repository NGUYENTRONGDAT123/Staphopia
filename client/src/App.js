import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/navbar";
import { Layout } from "antd";
import AMRPage from "./pages/AMRPage/AMRPage";
const { Footer, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <NavBar />
        <Content
          style={{
            margin: "8px 8px",
            background: "#fff",
            minHeight: 280,
          }}
        >
          {/* <Route exact path="/" component={HomePage} /> */}
          <Route path="/AMR" component={AMRPage} />
        </Content>
        <Footer style={{ textAlign: "center", margin: "0px 0px 0px 0px" }}>
          WebScape Team ©2021 StaphBook
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;

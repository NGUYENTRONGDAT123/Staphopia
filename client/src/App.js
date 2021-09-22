import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from "react-router-dom";
import NavBar from "./components/navbar";
import { Layout, Menu } from "antd";
import HomePage from "./pages/HomePage/HomePage";
import AMRPage from "./pages/AMRPage/AMRPage";
import { Header } from "antd/lib/layout/layout";
import ErrorPage from "./pages/ErrorPage";
import { GetNav } from "./api/AMRapi";
const { Footer, Content } = Layout;

function App() {
  let { repo } = GetNav();
  console.log(repo);
  return (
    <Router>
      <Layout style={{ height: "138h" }}>
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
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/AMR" component={AMRPage} />
            <Route path="*" component={ErrorPage} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: "center", margin: "0px 0px 0px 0px" }}>
          WebScape Team ©2021 StaphBook
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;

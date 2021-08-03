import React, {useEffect} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {BubbleChart} from './BubbleChart/BubbleChart';
import data2 from './TestingData/data2';
import {Navigation} from './Components/NavBar.js';
import {Layout, Row, Col, Tabs, Menu, Card} from 'antd';
const {Header, Footer, Content} = Layout;

function App () {
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

    (
      <Layout>
        <Layout>
          <Content>
            <Router>
              <Navigation />
              <Switch>
                {/* Home page */}
                <Route exact path="/" />
                <Route path="/AMR">
                  <Row gutter={[8, 8]} type="flex">
                    <Col span={5}>
                      <Card title={`Sample Selection`} />
                    </Col>
                    <Col span={13}>
                      <Row gutter={[8, 8]}>
                        <Col key="Bubble-chart" span={24}>
                          <Card title="Geographic Information System">
                            <BubbleChart
                              width="400"
                              height="400"
                              data={data2}
                            />
                          </Card>
                        </Col>
                      </Row>
                      <Row gutter={[8, 8]}>
                        <Col key="AMR-Table" span={24}>
                          <Card title="AMR Table" />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={6}>
                      <Row gutter={[8, 8]}>
                        <Col key="Sample-Info" span={24}>
                          <Card title="Sample Information" />
                        </Col>
                      </Row>
                      <Row gutter={[8, 8]}>
                        <Col key="AMR-Statistic" span={24}>
                          <Card title="AMR Statistic" />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Route>
                {/* </Router> */}
              </Switch>
            </Router>
          </Content>
        </Layout>
        <Footer style={{textAlign: 'center'}}>WebScape Team</Footer>
      </Layout>
    )
  );
}

export default App;

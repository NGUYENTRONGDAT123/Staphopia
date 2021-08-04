import React from "react";
import { Layout, Row, Col, Card } from "antd";
import { BubbleChart } from "../../BubbleChart/BubbleChart";
import { data2 } from "../../TestingData/data2";
const { Footer, Content } = Layout;

export const AMRPage = () => {
  return (
    <Layout>
      <Layout>
        <Content>
          <Row gutter={[8, 8]} type="flex">
            <Col span={5}>
              <Card title={`Sample Selection`} />
            </Col>
            <Col span={13}>
              <Row gutter={[8, 8]}>
                <Col key="Bubble-chart" span={24}>
                  <Card title="Geographic Information System">
                    <BubbleChart width="300" height="300" data={data2} />
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
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>WebScape Team</Footer>
    </Layout>
  );
};

import React from "react";
import { Row, Col, Card } from "antd";
import BubbleChart from "../../components/BubbleChart";
import data from "../../TestingData/data2";

import "antd/dist/antd.css";
export default function AMRPage() {
  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <Card title={`Sample Selection`} />
      </Col>
      <Col span={13}>
        <Row gutter={[8, 8]}>
          <Col key="Bubble-chart" span={24}>
            <Card title="Geographic Information System">
              <BubbleChart width="400" height="400" data={data} />
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
  );
}

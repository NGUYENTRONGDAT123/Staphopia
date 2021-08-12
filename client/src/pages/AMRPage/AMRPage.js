import React, { useState } from "react";
import { Row, Col, Card, Menu, Input, List, Button } from "antd";
import BubbleChart from "../../components/bubble-chart";
import SearchPanel from "../../components/SearchPanel";
import SampleInfoPanel from "../../components/sample-info-panel";
import data from "../../TestingData/data2";
import "./AMRPage.css";
import { useSelector, useDispatch } from "react-redux";

export default function AMRPage() {
  const SampleInfo = useSelector((state) => state.Visualization.sampleInfo);
  const AMRTable = useSelector((state) => state.Visualization.amrTable);
  const SampleSelect = useSelector(
    (state) => state.Visualization.sampleSelection
  );
  const dispatch = useDispatch();

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <SearchPanel />
      </Col>
      <Col span={13}>
        <Row gutter={[8, 8]}>
          <Col key="Bubble-chart" span={24}>
            <Card title="Geographic Information System">
              <BubbleChart width="900" height="900" />
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
            <Card title="Sample Information">
              <p>{SampleInfo ? SampleInfo : null}</p>
              <SampleInfoPanel />
            </Card>
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

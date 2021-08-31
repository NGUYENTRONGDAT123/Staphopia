import React, { useState, useEffect } from "react";
import { Row, Col, Card, Menu, Input, List, Button, Empty } from "antd";
// import { Row, Col } from "react-bootstrap";
import BubbleChart from "../../components/bubble-chart";
import SearchPanel from "../../components/search-panel";
import SampleInfoPanel from "../../components/sample-info-panel";
import "./AMRPage.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPackedCircleData,
  fetchSelectedSample,
  fetchSelectedAntibiotic,
} from "../../api/AMRapi";
import {
  dispatchDeleteSample,
  dispatchPackedCircleData,
  dispatchRestoreSample,
  dispatchPackedCircleRestoreData,
  selectSample,
  selectAntibiotic,
} from "../../redux/actions/visualization";
import AmrTable from "../../components/amr-table";
import AntibioticInfoPanel from "../../components/antibiotic-info-panel";
import NodeNetworkChart from "../../components/node-network-chart/NodeNetworkChart";
import * as d3 from "d3";

export default function AMRPage() {
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [isLoadingPacked, setIsLoadingPacked] = useState(false);
  const [isLoadingAntibiotic, setIsLoadingAntibiotic] = useState(false);

  const SampleInfoData = useSelector((state) => state.Visualization.sampleInfo);
  const AntibioticInfoData = useSelector(
    (state) => state.Visualization.antibioticInfo
  );

  const AMRTableData = useSelector((state) => state.Visualization.amrTable);
  const [AMRStatisticData, setAMRStatisticData] = useState(null);
  const SampleSelectData = useSelector(
    (state) => state.Visualization.sampleSelection
  );
  const PackedCircleData = useSelector(
    (state) => state.Visualization.packedCircleData
  );

  const PackedCircleRestoreData = useSelector(
    (state) => state.Visualization.packedCircleRestoreData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    async function getPackedData() {
      setIsLoadingPacked(true);
      const result = await fetchPackedCircleData();
      dispatch(dispatchPackedCircleData(result));
      dispatch(dispatchPackedCircleRestoreData(result));
      setIsLoadingPacked(false);
    }
    getPackedData();
  }, []);

  const handleSelectSample = async (sample) => {
    setIsLoadingSelect(true);
    const data = await fetchSelectedSample(sample);
    dispatch(selectSample(data));
    setIsLoadingSelect(false);
  };

  const handleSelectAntibiotic = async (antibiotic) => {
    setIsLoadingAntibiotic(true);
    const data = await fetchSelectedAntibiotic(antibiotic);
    dispatch(selectAntibiotic(data));
    setIsLoadingAntibiotic(false);
  };

  const handleDeleteSample = (samples) => {
    dispatch(dispatchDeleteSample(samples));
  };

  const handleRestoreSample = (samples) => {
    dispatch(dispatchRestoreSample(samples));
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <Card title="Search Sample" style={{ height: "100vh" }}>
          {PackedCircleData !== null && PackedCircleRestoreData !== null ? (
            <SearchPanel
              packedData={PackedCircleData}
              restorePoint={PackedCircleRestoreData}
              selectSample={handleSelectSample}
              deleteSample={handleDeleteSample}
              restoreSample={handleRestoreSample}
              selectAntibiotic={handleSelectAntibiotic}
            />
          ) : (
            <div />
          )}
        </Card>
      </Col>
      <Col span={19}>
        <Row gutter={[8, 8]} type="flex">
          <Col span={19}>
            <Card
              id="AMR-graph"
              title="AMR Visualizations"
              style={{ height: "60vh" }}
            >
              <BubbleChart
                width="500"
                height="500"
                data={PackedCircleData}
                isLoading={isLoadingPacked}
                selectSample={handleSelectSample}
                selectAntibiotic={handleSelectAntibiotic}
              />
              {/* <NodeNetworkChart height="400" width="1000" /> */}
            </Card>
          </Col>
          <Col span={5}>
            <Card title="Sample Information" style={{ height: "30vh" }}>
              {SampleInfoData !== null ? (
                <SampleInfoPanel
                  sampleMetadata={SampleInfoData}
                  isLoading={isLoadingSelect}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Please select sample</span>}
                />
              )}
            </Card>
            <Card title="Antibiotic Information" style={{ height: "30vh" }}>
              {AntibioticInfoData !== null ? (
                <AntibioticInfoPanel
                  antibioticData={AntibioticInfoData}
                  isLoading={isLoadingAntibiotic}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Please select sample</span>}
                />
              )}
            </Card>
          </Col>
        </Row>
        <Row gutter={[8, 8]} type="flex">
          <Col key="AMR-Table" span={24}>
            <Card title="AMR Table" style={{ height: "40vh" }}>
              <AmrTable data={AMRTableData} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import BubbleChart from "../../components/bubble-chart";
import SearchPanel from "../../components/search-panel";
import SampleInfoPanel from "../../components/sample-info-panel";
// import data from "../../TestingData/data2";
import "./AMRPage.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchPackedCircleData, fetchSelectedSample } from "../../api/AMRapi";
import {
  dispatchDeleteSample,
  dispatchPackedCircleData,
  dispatchRestoreSample,
  selectSample,
} from "../../redux/actions/visualization";
import AmrTable from "../../components/AmrTable";

export default function AMRPage() {
  const [isLoadingPacked, setIsLoadingPacked] = useState(false);
  const SampleInfoData = useSelector((state) => state.Visualization.sampleInfo);
  const AMRTableData = useSelector((state) => state.Visualization.amrTable);
  const SampleSelectData = useSelector(
    (state) => state.Visualization.sampleSelection
  );
  const PackedCircleData = useSelector(
    (state) => state.Visualization.packedCircleData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    async function getPackedData() {
      setIsLoadingPacked(true);
      const result = await fetchPackedCircleData();
      dispatch(dispatchPackedCircleData(result));
      setIsLoadingPacked(false);
    }
    getPackedData();
  }, []);

  const handleSelectSample = async (sample) => {
    const data = await fetchSelectedSample(sample);
    dispatch(selectSample(data));
  };

  const handleDeleteSample = (samples) => {
    dispatch(dispatchDeleteSample(samples));
  };

  const handleRestoreSample = (samples) => {
    dispatch(dispatchRestoreSample(samples));
  };
  return (
    <Row className="px-3">
      <Col lg={3}>
        <SearchPanel
          packedData={PackedCircleData}
          selectSample={handleSelectSample}
          deleteSample={handleDeleteSample}
          restorSample={handleRestoreSample}
        />
      </Col>
      <Col lg={9}>
        <Row>
          <Col key="Bubble-chart" lg={9}>
            <BubbleChart
              width="900"
              height="900"
              data={PackedCircleData}
              isLoading={isLoadingPacked}
            />
          </Col>
          <Col lg={3}>
            <Row>
              <Col key="Sample-Info">
                <SampleInfoPanel />
              </Col>
            </Row>
            <Row>
              <Col key="AMR-Statistic">
                <div>alo</div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="my-4">
          <Col key="AMR-Table">
            <AmrTable />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

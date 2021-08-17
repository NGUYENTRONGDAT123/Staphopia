import React, {useState, useEffect} from 'react';
import { Row, Col, Card, Menu, Input, List, Button } from "antd";
import BubbleChart from '../../components/bubble-chart';
import SearchPanel from '../../components/search-panel';
import SampleInfoPanel from '../../components/sample-info-panel';
// import data from "../../TestingData/data2";
import './AMRPage.css';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPackedCircleData, fetchSelectedSample} from '../../api/AMRapi';
import {
  dispatchDeleteSample,
  dispatchPackedCircleData,
  dispatchRestoreSample,
  selectSample,
} from '../../redux/actions/visualization';
import AmrTable from '../../components/amr-table';

export default function AMRPage () {
  const [isLoadingPacked, setIsLoadingPacked] = useState (false);
  const SampleInfoData = useSelector (state => state.Visualization.sampleInfo);
  const AMRTableData = useSelector (state => state.Visualization.amrTable);
  const SampleSelectData = useSelector (
    state => state.Visualization.sampleSelection
  );
  const PackedCircleData = useSelector (
    state => state.Visualization.packedCircleData
  );
  const dispatch = useDispatch ();

  useEffect (() => {
    async function getPackedData () {
      setIsLoadingPacked (true);
      const result = await fetchPackedCircleData ();
      dispatch (dispatchPackedCircleData (result));
      setIsLoadingPacked (false);
    }
    getPackedData ();
  }, []);

  const handleSelectSample = async sample => {
    const data = await fetchSelectedSample (sample);
    dispatch (selectSample (data));
  };

  const handleDeleteSample = samples => {
    dispatch (dispatchDeleteSample (samples));
  };

  const handleRestoreSample = samples => {
    dispatch (dispatchRestoreSample (samples));
  };
  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <SearchPanel
          packedData={PackedCircleData}
          selectSample={handleSelectSample}
          deleteSample={handleDeleteSample}
          restorSample={handleRestoreSample}
        />
      </Col>
      <Col span={13}>
        <Row gutter={[8, 8]}>
          <Col key="Bubble-chart" span={24}>
            <Card title="AMR Visualisations">
              <BubbleChart
                width="900"
                height="900"
                data={PackedCircleData}
                isLoading={isLoadingPacked}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col key="AMR-Table" span={24}>
            <Card title="AMR Table">
              <AmrTable />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Row gutter={[8, 8]}>
          <Col key="Sample-Info" span={24}>
            <Card title="Sample Information">
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

import React, {useState, useEffect} from 'react';
import {Row, Col, Card, Menu, Input, List, Button} from 'antd';
import BubbleChart from '../../components/BubbleChart';
import SearchPanel from '../../components/SearchPanel';
import SampleInfoPanel from '../../components/SampleInfoPanel';
import data from '../../TestingData/data2';
import './AMRPage.css';
import {useSelector, useDispatch} from 'react-redux';
import {PackedCircleData} from '../../API/AMRapi';
import {fetchPackedCircleData} from '../../redux/actions/visualization';
import axios from 'axios';

export default function AMRPage () {
  const SampleInfo = useSelector (state => state.Visualization.sampleInfo);
  const AMRTable = useSelector (state => state.Visualization.amrTable);
  const SampleSelect = useSelector (
    state => state.Visualization.sampleSelection
  );
  const dispatch = useDispatch ();

  const [data, setData] = useState (null);
  const [loading, setLoading] = useState (false);
  const [error, setError] = useState (false);

  useEffect (() => {
    getData ();    
  }, []);

  async function getData () {
    const url = '/api/packed-circle';
    await axios
      .get (url)
      .then (response => {
        setData (response.data.result);
        dispatch (fetchPackedCircleData (response.data.result));
      })
      .catch (error => {
        console.error ('Error fetching data: ', error);
        setError (error);
      })
      .finally (() => {
        setLoading (false);
      });
  }

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <SearchPanel />
      </Col>
      <Col span={13}>
        <Row gutter={[8, 8]}>
          <Col key="Bubble-chart" span={24}>
            <Card title="Geographic Information System">
              {/* <BubbleChart width="900" height="900" /> */}
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

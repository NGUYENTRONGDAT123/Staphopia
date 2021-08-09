import React, {useState} from 'react';
import {Row, Col, Card, Menu, Input, Space} from 'antd';
import BubbleChart from '../../components/BubbleChart';
import data from '../../TestingData/data2';
import {DeleteOutlined} from '@ant-design/icons';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';

const {Search} = Input;
const SAMPLES = ['99', '100', '101', '102', '103', '104'];

export default function AMRPage () {
  const [availableSample, setAvailableSample] = useState (SAMPLES);
  // const [toAddSample, setToAddSample] = useState ([]);

  const [name, setName] = useState ('');
  const [toAddSample, setToAddSample] = useState ([]);
  const [foundSample, setFoundSample] = useState ([]);

  const filter = e => {
    const keyword = e.target.value;
    if (keyword !== '') {
      const results = toAddSample.filter (sample => {
        return sample.toLowerCase ().startsWith (keyword.toLowerCase ());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundSample (results);
    } else {
      setFoundSample (toAddSample);
      // If the text field is empty, show all samples
    }

    setName (keyword);
  };

  const handleDelete = value => {
    if (value.key !== 'notFound') {
      let sampleToDelete = value.key;
      const newAvailableList = availableSample.filter (
        sample => sample !== sampleToDelete
      );
      const newToAddList = toAddSample.concat (sampleToDelete);
      const newFoundList = foundSample.concat (sampleToDelete);
      setAvailableSample (newAvailableList);
      setToAddSample (newToAddList);
      setFoundSample (newFoundList);
    }
  };

  const handleAdd = value => {
    if (value.key !== 'notFound') {
      let sampleToDelete = value.key;
      const newToAddList = toAddSample.filter (
        sample => sample !== sampleToDelete
      );
      const newFoundList = foundSample.filter (
        sample => sample !== sampleToDelete
      );
      const newAvailableList = availableSample.concat (sampleToDelete);
      setAvailableSample (newAvailableList);
      setToAddSample (newToAddList);
      setFoundSample (newFoundList);
    }
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <Card title={`Sample to Remove`}>
          <Menu mode="inline" >
            {availableSample && availableSample.length > 0
              ? availableSample.map (sample => (
                  <Menu.Item
                    key={sample}
                    icon={
                      <DeleteOutlined key={sample} style={{float:'right'}} onClick={handleDelete} />
                    }
                  >
                    {sample}
                  </Menu.Item>
                ))
              : <Menu.Item disabled={true} key="notFound">
                  No results found
                </Menu.Item>}

          </Menu>
        </Card>
        <Card title={`Sample to Add`}>
          <input
            type="search"
            value={name}
            onChange={filter}
            className="input"
            placeholder="Filter"
          />
          <Menu mode="inline" onClick={handleAdd}>
            {foundSample.length > 0
              ? foundSample.map (sample => (
                  <Menu.Item key={sample}>{sample}</Menu.Item>
                ))
              : <Menu.Item disabled={true} key="notFound">
                  No results found
                </Menu.Item>}
          </Menu>
        </Card>
      </Col>
      <Col span={13}>
        <Row gutter={[8, 8]}>
          <Col key="Bubble-chart" span={24}>
            <Card title="Geographic Information System">
              <BubbleChart width="900" height="900" data={data} />
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

import React, {useState} from 'react';
import {Row, Col, Card, Menu, Input, List, Button} from 'antd';
import BubbleChart from '../../components/BubbleChart';
import data from '../../TestingData/data2';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import './AMRPage.css';
import { useSelector } from "react-redux";


const SAMPLES = [...Array (100).keys ()].map (i => i + 1);

export default function AMRPage () {
  const SampleInfo = useSelector((state) => state.Visualization.sampleInfo);
  const AMRTable = useSelector((state) => state.Visualization.amrTable);
  const [name, setName] = useState ('');
  const [availableSample, setAvailableSample] = useState (SAMPLES);
  const [toAddSample, setToAddSample] = useState ([]);
  const [foundSample, setFoundSample] = useState ([]);

  const filter = e => {
    const keyword = e.target.value;
    if (keyword !== '') {
      const results = toAddSample.filter (sample => {
        return sample.toString().toLowerCase ().startsWith (keyword.toLowerCase ());
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
    console.log (value);
    if (value !== 'notFound') {
      let sampleToDelete = value;
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
    if (value !== 'notFound') {
      let sampleToDelete = value;
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
          <List
            dataSource={availableSample}
            style={{overflow: 'auto', height: '30vh'}}
            renderItem={item => (
              <List.Item key={item} onMouseEnter={() => console.log('alo')} onClick={() => {console.log("click")}}>
                <List.Item.Meta title={item} />
                <Button
                  key={item}
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={e => {
                    e.stopPropagation ();
                    handleDelete (item);
                  }}
                />
              </List.Item>
            )}
          />

          {/* <Menu mode="inline" key={`remove-sample`}>
            {availableSample && availableSample.length > 0
              ? availableSample.map (sample => (
                  <Menu.Item
                    key={sample}                    
                    onClick={handleDelete}
                  >
                    {sample}
                  </Menu.Item>
                ))
              : <Menu.Item disabled={true} key="notFound">
                  No results found
                </Menu.Item>}

          </Menu> */}
        </Card>
        <Card title={`Sample to Add`}>
          {/* <input
            type="search"
            value={name}
            onChange={filter}
            className="input"
            placeholder="Filter"
            style={{width: '30vh'}}
          /> */}
          <Input value={name} onChange= {filter} placeholder="search sample" prefix={<EditOutlined />} />
          <List
            dataSource={foundSample}
            style={{overflow: 'auto', height: '30vh'}}
            renderItem={item => (
              <List.Item key={item}>
                <List.Item.Meta title={item} />
                <Button
                  key={item}
                  type="text"
                  icon={<EditOutlined />}
                  onClick={e => {
                    e.stopPropagation ();
                    handleAdd (item);
                  }}
                />
              </List.Item>
            )}
          />
          {/* <Menu mode="inline" onClick={handleAdd}>
            {foundSample.length > 0
              ? foundSample.map (sample => (
                  <Menu.Item key={sample}>{sample}</Menu.Item>
                ))
              : <Menu.Item disabled={true} key="notFound">
                  No results found
                </Menu.Item>}
          </Menu> */}
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
            <Card title="Sample Information">
              <p>{SampleInfo ? SampleInfo.data.name : null}</p>
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

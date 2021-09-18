import React, {useState, useEffect} from 'react';
import {Row, Col, Card, Menu, Input, List, Button, Empty} from 'antd';
// import { Row, Col } from "react-bootstrap";
import BubbleChart from '../../components/bubble-chart';
import NetworkChart from '../../components/network-chart/NetworkChart';
import SearchPanel from '../../components/search-panel';
import FilterPanel from '../../components/filter-panel/FilterPanel';
import SampleInfoPanel from '../../components/sample-info-panel';
import {
  DataSet,
  Network,
  parseGephiNetwork,
} from 'vis-network/standalone/esm/vis-network';

// import data from "../../TestingData/data2";
import './AMRPage.css';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchPackedCircleData,
  fetchSelectedSample,
  fetchSelectedAntibiotic,
  fetchNetworkData,
} from '../../api/AMRapi';
import {
  dispatchDeleteSample,
  dispatchRestoreSample,
  dispatchPackedCircleData,
  dispatchPackedCircleRestoreData,
  dispatchDeleteAntibiotic,
  dispatchRestoreAntibiotic,
  dispatchNetworkData,
  dispatchNetworkRestoreData,
  dispatchSelectMst,
  selectSample,
  selectAntibiotic,
} from '../../redux/actions/visualization';
import AmrTable from '../../components/amr-table';
import AntibioticInfoPanel from '../../components/antibiotic-info-panel';

import ProcessNode from '../../components/network-chart/ProcessNode';

export default function AMRPage () {
  const [isLoadingSelect, setIsLoadingSelect] = useState (false);
  const [isLoadingPacked, setIsLoadingPacked] = useState (false);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState (false);
  const [isLoadingAntibiotic, setIsLoadingAntibiotic] = useState (false);
  const [tabKey, setTabKey] = useState ('bubbleGraph');

  const SampleInfoData = useSelector (state => state.Visualization.sampleInfo);
  const AntibioticInfoData = useSelector (
    state => state.Visualization.antibioticInfo
  );
  const AMRTableData = useSelector (state => state.Visualization.amrTable);
  const PackedCircleData = useSelector (
    state => state.Visualization.packedCircleData
  );

  const PackedCircleRestoreData = useSelector (
    state => state.Visualization.packedCircleRestoreData
  );

  const NetworkData = useSelector (state => state.Visualization.networkData);

  const NetworkRestoreData = useSelector (
    state => state.Visualization.networkRestoreData
  );

  const dispatch = useDispatch ();

  useEffect (
    () => {
      async function getPackedData () {
        setIsLoadingPacked (true);
        const result = await fetchPackedCircleData ();
        dispatch (dispatchPackedCircleData (result));
        dispatch (dispatchPackedCircleRestoreData (result));
        setIsLoadingPacked (false);
      }
      getPackedData ();

      async function getNetworkData () {
        setIsLoadingNetwork (true);
        const result = await fetchNetworkData ();
        dispatch (dispatchNetworkData (result));
        dispatch (dispatchNetworkRestoreData (result));
        setIsLoadingNetwork (false);
      }
      getNetworkData ();
    },
    [tabKey, dispatch]
  );

  const handleSelectSample = async sample => {
    setIsLoadingSelect (true);
    const data = await fetchSelectedSample (sample);
    dispatch (selectSample (data));
    setIsLoadingSelect (false);
  };

  const handleSelectAntibiotic = async antibiotic => {
    setIsLoadingAntibiotic (true);
    const data = await fetchSelectedAntibiotic (antibiotic);
    dispatch (selectAntibiotic (data));
    setIsLoadingAntibiotic (false);
  };

  const handleDeleteSample = samples => {
    dispatch (dispatchDeleteSample (samples));
  };

  const handleRestoreSample = samples => {
    dispatch (dispatchRestoreSample (samples));
  };

  const handleDeleteAntibiotic = antibiotics => {
    dispatch (dispatchDeleteAntibiotic (antibiotics));
  };

  const handleRestoreAntibiotic = antibiotics => {
    dispatch (dispatchRestoreAntibiotic (antibiotics));
  };

  const handleSelectMst = value => {
    dispatch (dispatchSelectMst (value));
  };

  const tabList = [
    {
      key: 'bubbleGraph',
      tab: 'AMR Bubble Graph',
    },
    {
      key: 'networkGraph',
      tab: 'AMR Network Graph',
    },
  ];

  const onTabChange = key => {
    console.log (key);
    setTabKey (key);
  };

  let searchPanel;
  if (tabKey === 'bubbleGraph') {
    if (PackedCircleData !== null && PackedCircleRestoreData !== null) {
      searchPanel = (
        <SearchPanel
          packedData={PackedCircleData}
          restorePoint={PackedCircleRestoreData}
          selectSample={handleSelectSample}
          deleteSample={handleDeleteSample}
          restoreSample={handleRestoreSample}
          selectAntibiotic={handleSelectAntibiotic}
        />
      );
    } else {
      searchPanel = (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>Loading sample data</span>}
        />
      );
    }
  } else if (tabKey === 'networkGraph') {
    if (NetworkData !== null && NetworkRestoreData !== null) {
      searchPanel = (
        <FilterPanel
          networkData={NetworkData}
          restorePoint={NetworkRestoreData}
          deleteAntibiotic={handleDeleteAntibiotic}
          restoreAntibiotic={handleRestoreAntibiotic}
          selectMst={handleSelectMst}
        />
      );
      // <div>Filter Panel</div>
    } else {
      searchPanel = (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>Loading network data</span>}
        />
      );
    }
  }
  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <Card title="Search Sample" style={{height: '60vh'}}>
          {searchPanel}
        </Card>
        <Card title="Sample Information" style={{height: '30vh'}}>
          {SampleInfoData !== null
            ? <SampleInfoPanel
                sampleMetadata={SampleInfoData}
                isLoading={isLoadingSelect}
              />
            : <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>Please select sample</span>}
              />}
        </Card>
        <Card title="Antibiotic Information" style={{height: '30vh'}}>
          {AntibioticInfoData !== null
            ? <AntibioticInfoPanel
                antibioticData={AntibioticInfoData}
                isLoading={isLoadingAntibiotic}
              />
            : <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>Please select sample</span>}
              />}
        </Card>
      </Col>
      <Col span={19}>
        <Row gutter={[8, 8]} type="flex">
          <Col span={24}>
            {/* <Card title="AMR Visualizations" style={{height: '60vh'}}>
              <BubbleChart
                width="500"
                height="500"
                data={PackedCircleData}
                isLoading={isLoadingPacked}
                selectSample={handleSelectSample}
                selectAntibiotic={handleSelectAntibiotic}
              />
            </Card> */}
            <Card
              style={{height: '60vh'}}
              tabList={tabList}
              activeTabKey={tabKey}
              onTabChange={key => {
                onTabChange (key);
              }}
            >
              {tabKey === 'bubbleGraph'
                ? <BubbleChart
                    width="500"
                    height="500"
                    data={PackedCircleData}
                    isLoading={isLoadingPacked}
                    selectSample={handleSelectSample}
                    selectAntibiotic={handleSelectAntibiotic}
                  />
                : <NetworkChart
                    data={NetworkData}
                    isLoading={isLoadingNetwork}
                  />
              // <ProcessNode data={NetworkData} />
              }
            </Card>
          </Col>
        </Row>
        <Row gutter={[8, 8]} type="flex">
          <Col key="AMR-Table" span={24}>
            <Card title="AMR Table" style={{height: '60vh'}}>
              <AmrTable data={AMRTableData} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

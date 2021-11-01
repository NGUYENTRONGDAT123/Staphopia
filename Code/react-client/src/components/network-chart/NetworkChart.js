import React from "react";
import "./NetworkChart.css";
import { Spin } from "antd";
import Network from "./NodeNetwork";
import ProcessNode from "./ProcessNode";

export default function NetworkChart(props) {
  const { data, isLoading, selectSample } = props;

  let { finalData, loading } = ProcessNode(data);

  if (isLoading === false && loading === false) {
    // console.log(finalData);
    return (
      <Network
        data={finalData}
        distance={70}
        strength={-600}
        maxDistance={100}
        name={"node-network"}
        nodeName={"node"}
        lineName={"line"}
        nodeRatio={0.8}
        width1={1500}
        height1={500}
        xOffset={0}
        selectSample={selectSample}
      />
    );
  } else {
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <Spin />
      </div>
    );
  }
}

import React, { useState, useEffect } from "react";
import { Spin } from "antd";

export default function AntibioticInfoPanel(props) {
  const {antibioticData, isLoading} = props;



  if (isLoading)
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <Spin />
      </div>
    );
  return (
    <div>Hello</div>
  );
}

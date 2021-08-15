import React, { useState, useEffect } from "react";
import { Row, Col, Card, Menu, Input, List, Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { selectSample } from "../../redux/actions/visualization";
import axios from "axios";

export default function SampleInfoPanel() {
  const SampleInfo = useSelector((state) => state.Visualization.sampleInfo);
  const AMRTable = useSelector((state) => state.Visualization.amrTable);
  const SampleSelect = useSelector(
    (state) => state.Visualization.sampleSelection
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    // const url = 'https://staphopia.emory.edu/api/sample/500/';
    // const token = '7641a07e816112f899be1388e7df87526fb0b04e';
    // await axios
    //   .get (url, {
    //     headers: {
    //       'Authorization': `Token ${token}`,
    //     }
    //   })
    //   .then (response => {
    //     setData (response.data);
    //   })
    //   .catch (error => {
    //     console.error ('Error fetching data: ', error);
    //     setError (error);
    //   })
    //   .finally (() => {
    //     setLoading (false);
    //   });
  }

  if (loading) return <div>Loading ...</div>;
  if (error) return <div>Error</div>;

  // console.log(data);

  // 7641a07e816112f899be1388e7df87526fb0b04e
  return <div>ok</div>;
}
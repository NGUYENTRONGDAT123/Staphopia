import React, { useEffect, useCallback, useRef, useState } from "react";
import "./NetworkChart.css";
import {
  DataSet,
  parseGephiNetwork,
} from "vis-network/standalone/esm/vis-network";
import { range } from "d3-array";
import Network from "./NodeNetwork";
import ProcessNode from "./ProcessNode";
const similarity = require("compute-cosine-similarity");
const jsnx = require("jsnetworkx"); // in Node
const jLouvain = require("jlouvain");

export default function NetworkChart(props) {
  const { data, isLoading } = props;
  // const [finalData, setFinalData] = useState({});
  // const [loading, setLoading] = useState(true);

  // const ProcessNode = () => {
  //   let networkData = data;
  //   let labels = [];
  //   let threshold = 0.7;
  //   let availableSubclasses = networkData
  //     .map((a) => a.subclasses)
  //     .flat(1)
  //     .filter((v, i, a) => a.indexOf(v) === i)
  //     .sort();

  //   for (let i = 0; i < networkData.length; i++) {
  //     labels.push(networkData[i]._id.replace(".csv", ""));
  //   }

  //   let networkMatrix = Array(networkData.length)
  //     .fill()
  //     .map(() => Array(networkData.length));

  //   let descriptionMatrix = Array(networkData.length)
  //     .fill()
  //     .map(() => Array(networkData.length));

  //   for (let i = 0; i < networkData.length; i++) {
  //     for (let j = 0; j < networkData.length; j++) {
  //       let a = [];
  //       let b = [];
  //       for (let k = 0; k < availableSubclasses.length; k++) {
  //         a[k] = networkData[i].subclasses.filter(
  //           (x) => x === availableSubclasses[k]
  //         ).length;
  //         b[k] = networkData[j].subclasses.filter(
  //           (x) => x === availableSubclasses[k]
  //         ).length;
  //       }
  //       let cosine_similarity = similarity(a, b);
  //       let filteredArray = networkData[i].subclasses.filter((value) =>
  //         networkData[j].subclasses.includes(value)
  //       );
  //       descriptionMatrix[i][j] = filteredArray;

  //       if (cosine_similarity < threshold) {
  //         networkMatrix[i][j] = 0;
  //       } else {
  //         networkMatrix[i][j] = similarity(a, b);
  //       }
  //     }
  //   }

  //   let finalData = {};
  //   finalData.nodes = [];
  //   finalData.links = [];

  //   let index = 0;
  //   for (let i = 0; i < labels.length - 1; i++) {
  //     for (let j = i + 1; j < labels.length; j++) {
  //       if (networkMatrix[i][j] > 0) {
  //         index = index + 1;
  //         finalData.links.push({
  //           source: i + 1,
  //           target: j + 1,
  //           weight: networkMatrix[i][j],
  //           id: index,
  //           description: [...new Set(descriptionMatrix[i][j])].sort(),
  //         });
  //       }
  //     }
  //   }

  //   // let node_data = finalData.nodes.map (function (d) {
  //   //   return d.id;
  //   // });

  //   let node_data = [...range(1, labels.length + 1)];
  //   let edge_data = finalData.links.map(function (d) {
  //     return [d.source, d.target, d.weight];
  //   });

  //   //var G = new jsnx.cycleGraph();
  //   var G = new jsnx.Graph();
  //   G.addNodesFrom(node_data);
  //   G.addEdgesFrom(edge_data);

  //   let betweenness = jsnx.betweennessCentrality(G);
  //   // let eigenvector = jsnx.eigenvectorCentrality (G);
  //   // let clustering = jsnx.clustering (G);
  //   let sizeRange = [20, 50];
  //   let betweennessArray = Object.values(betweenness._numberValues);
  //   let ratio = Math.max.apply(Math, betweennessArray);
  //   // let normalized = [];
  //   // for (let i = 0; i < betweennessArray.length; i++) {
  //   //   normalized[i] = (betweennessArray[i] / ratio) * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
  //   // }

  //   for (let i = 0; i < labels.length; i++) {
  //     finalData.nodes.push({
  //       label: labels[i],
  //       id: i + 1,
  //       size:
  //         (betweennessArray[i] / ratio) * (sizeRange[1] - sizeRange[0]) +
  //         sizeRange[0],
  //     });
  //   }
  //   setFinalData(finalData);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   ProcessNode();
  //   // https://github.com/jgranstrom/jLouvain/blob/master/example/example.html
  // }, [finalData, loading]);

  let { finalData, loading } = ProcessNode(data);

  if (isLoading === false && loading === false) {
    console.log(finalData);
    return (
      <Network
        data={finalData}
        distance={70}
        strength={-600}
        maxDistance={100}
        name={"node-network"}
        nodeName={"node"}
        lineName={"line"}
        nodeRatio={0.6}
        width1={1500}
        height1={500}
        xOffset={0}
      />
    );
  } else {
    return <h1>Hello</h1>;
  }
}

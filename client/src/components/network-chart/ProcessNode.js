import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './NetworkChart.css';
const similarity = require ('compute-cosine-similarity');
const jsnx = require ('jsnetworkx'); // in Node
const jLouvain = require ('jlouvain');
const k = require ('kruskal-mst');

export default function ProcessNode (data) {
  //   const { data } = props;
  const [finalData, setFinalData] = useState ([]);
  const [loading, setLoading] = useState (true);
  const isMst = useSelector (state => state.Visualization.selectMst);

  const process = async () => {
    let networkData = data;
    let labels = [];
    let threshold = 0.7;

    let colorBrewer = {
      Set2: {
        1: ['rgb(252,141,98)'],
        2: ['rgb(252,141,98)', 'rgb(141,160,203)'],
        3: ['rgb(102,194,165)', 'rgb(252,141,98)', 'rgb(141,160,203)'],
        4: [
          'rgb(102,194,165)',
          'rgb(252,141,98)',
          'rgb(141,160,203)',
          'rgb(231,138,195)',
        ],
        5: [
          'rgb(102,194,165)',
          'rgb(252,141,98)',
          'rgb(141,160,203)',
          'rgb(231,138,195)',
          'rgb(166,216,84)',
        ],
        6: [
          'rgb(102,194,165)',
          'rgb(252,141,98)',
          'rgb(141,160,203)',
          'rgb(231,138,195)',
          'rgb(166,216,84)',
          'rgb(255,217,47)',
        ],
        7: [
          'rgb(102,194,165)',
          'rgb(252,141,98)',
          'rgb(141,160,203)',
          'rgb(231,138,195)',
          'rgb(166,216,84)',
          'rgb(255,217,47)',
          'rgb(229,196,148)',
        ],
        8: [
          'rgb(102,194,165)',
          'rgb(252,141,98)',
          'rgb(141,160,203)',
          'rgb(231,138,195)',
          'rgb(166,216,84)',
          'rgb(255,217,47)',
          'rgb(229,196,148)',
          'rgb(179,179,179)',
        ],
      },
    };

    let availableSubclasses = networkData
      .map (a => a.subclasses)
      .flat (1)
      .filter ((v, i, a) => a.indexOf (v) === i)
      .sort ();

    for (let i = 0; i < networkData.length; i++) {
      labels.push (networkData[i]._id.replace ('.csv', ''));
    }

    let networkMatrix = Array (networkData.length)
      .fill ()
      .map (() => Array (networkData.length));

    let descriptionMatrix = Array (networkData.length)
      .fill ()
      .map (() => Array (networkData.length));

    for (let i = 0; i < networkData.length; i++) {
      for (let j = 0; j < networkData.length; j++) {
        let a = [];
        let b = [];
        for (let k = 0; k < availableSubclasses.length; k++) {
          a[k] = networkData[i].subclasses.filter (
            x => x === availableSubclasses[k]
          ).length;
          b[k] = networkData[j].subclasses.filter (
            x => x === availableSubclasses[k]
          ).length;
        }
        let cosine_similarity = similarity (a, b);
        let filteredArray = networkData[i].subclasses.filter (value =>
          networkData[j].subclasses.includes (value)
        );
        descriptionMatrix[i][j] = filteredArray;

        if (cosine_similarity < threshold) {
          networkMatrix[i][j] = 0;
        } else {
          networkMatrix[i][j] = similarity (a, b);
        }
      }
    }

    let nodeData = [];
    let edgeData = [];
    let finalDataTemp = {};
    finalDataTemp.nodes = [];
    finalDataTemp.links = [];

    let index = labels.length + 2;
    for (let i = 0; i < labels.length - 1; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        if (networkMatrix[i][j] > 0) {
          index = index + 1;
          finalDataTemp.links.push ({
            source: i + 1,
            target: j + 1,
            weight: networkMatrix[i][j],
            id: index,
            description: [...new Set (descriptionMatrix[i][j])].sort (),
          });
          nodeData.push (i + 1);
          nodeData.push (j + 1);
        }
      }
    }

    if (isMst) {
      let edges = finalDataTemp.links.map (function (item) {
        return {
          from: item.source,
          to: item.target,
          weight: item.weight,
          id: item.id,
          description: item.description,
          color: item.color,
        };
      });
      let mst = k.kruskal (edges);
      console.log (mst);
      finalDataTemp.links = mst.map (function (item) {
        return {
          source: item.from,
          target: item.to,
          weight: item.weight,
          id: item.id,
          description: item.description,
          color: item.color,
        };
      });
    }

    nodeData = [...new Set (nodeData)];
    edgeData = finalDataTemp.links.map (function (d) {
      return [d.source, d.target, d.weight];
    });

    var G = new jsnx.Graph ();
    G.addNodesFrom (nodeData);
    G.addEdgesFrom (edgeData);

    let betweenness = jsnx.betweennessCentrality (G);
    let sizeRange = [20, 50];
    let betweennessArray = Object.values (betweenness._numberValues);
    let ratio = Math.max.apply (Math, betweennessArray);

    let edgeCommunityData = [];
    for (let i = 0; i < edgeData.length; i++) {
      edgeCommunityData.push ({
        source: edgeData[i][0],
        target: edgeData[i][1],
        weight: edgeData[i][2],
      });
    }
    let community = jLouvain
      .jLouvain ()
      .nodes (nodeData)
      .edges (edgeCommunityData);
    let result = community ();
    let nCommunity = Math.max.apply (Math, Object.values (result)) + 1;

    console.log (result);
    console.log (nCommunity);

    for (let i = 0; i < nodeData.length; i++) {
      if (ratio > 0) {
        finalDataTemp.nodes.push ({
          label: labels[nodeData[i] - 1],
          id: nodeData[i],
          size: betweennessArray[i] / ratio * (sizeRange[1] - sizeRange[0]) +
            sizeRange[0],
          color: colorBrewer.Set2[nCommunity][result[nodeData[i]]],
          description: [
            ...new Set (networkData[nodeData[i] - 1].subclasses),
          ].join (','),
        });
      } else {
        finalDataTemp.nodes.push ({
          label: labels[nodeData[i] - 1],
          id: nodeData[i],
          size: sizeRange[0],
          color: colorBrewer.Set2[nCommunity][result[nodeData[i]]],
          description: [
            ...new Set (networkData[nodeData[i] - 1].subclasses),
          ].join (','),
        });
      }
    }

    for (let i = 0; i < finalDataTemp.links.length; i++) {
      finalDataTemp.links[i].color =
        colorBrewer.Set2[nCommunity][result[finalDataTemp.links[i].source]];
    }

    setFinalData (finalDataTemp);
    setLoading (false);
  };

  useEffect (
    () => {
      setFinalData ([]);
      process ();
      console.log (finalData);
    },
    [data, isMst]
  );

  return {finalData, loading};
}

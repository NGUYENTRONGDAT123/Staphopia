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
    let networkData = data; // the data fetched from https://staphbook.herokuapp.com/api/subclass-sample
    let labels = []; // array to contain labels of the nodes (sample ID)
    let threshold = 0.7; // threshold to remove insignificant link

    // color set for different clusters
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

    // get all unique subclasses and store them in array. There are 19 unique subclasses
    let availableSubclasses = networkData
      .map (a => a.subclasses)
      .flat (1)
      .filter ((v, i, a) => a.indexOf (v) === i)
      .sort ();

    // store sample ID as labels for the nodes
    for (let i = 0; i < networkData.length; i++) {
      labels.push (networkData[i]._id.replace ('.csv', ''));
    }

    // construct a zeros 98x98 matrix to store cosine similarity values
    let networkMatrix = Array (networkData.length)
      .fill ()
      .map (() => Array (networkData.length));

    // construct a zeros 98x98 matrix to store description for links
    let descriptionMatrix = Array (networkData.length)
      .fill ()
      .map (() => Array (networkData.length));

    // loop through all samples data twice
    for (let i = 0; i < networkData.length; i++) {
      for (let j = 0; j < networkData.length; j++) {
        // reconstructed vectors by counting number of subclass occurs for 2 samples
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

        // calculate cosine_similarity between two samples
        let cosine_similarity = similarity (a, b);

        // get the description for the links. Description = subclasses that appear in both sample
        let filteredArray = networkData[i].subclasses.filter (value =>
          networkData[j].subclasses.includes (value)
        );
        descriptionMatrix[i][j] = filteredArray;

        // remove insignificant value
        if (cosine_similarity < threshold) {
          networkMatrix[i][j] = 0;
        } else {
          networkMatrix[i][j] = similarity (a, b);
        }
      }
    }

    // Initiate the network data
    let nodeData = []; // used for betweenness, MST and cluster calculation
    let edgeData = []; // used for betweenness, MST and cluster calculation
    let finalDataTemp = {}; // final data used for render D3 graph
    finalDataTemp.nodes = [];
    finalDataTemp.links = [];

    // add links data
    let index = labels.length + 2;
    for (let i = 0; i < labels.length - 1; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        if (networkMatrix[i][j] > 0) {
          index = index + 1;
          // add data from the cosine matrix and description matrix
          finalDataTemp.links.push ({
            source: i + 1,
            target: j + 1,
            weight: networkMatrix[i][j],
            id: index,
            description: [...new Set (descriptionMatrix[i][j])].sort (),
          });

          // add node ID to array
          nodeData.push (i + 1);
          nodeData.push (j + 1);
        }
      }
    }

    // if option for MST is checked
    if (isMst) {
      // Re-calculate the final data links
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

      // apply Kruskal's Algorithm to minimize to number of links
      let mst = k.kruskal (edges);
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

    // get unique node ID
    nodeData = [...new Set (nodeData)];

    // get edge data to calculate the betweenness centrality
    edgeData = finalDataTemp.links.map (function (d) {
      return [d.source, d.target, d.weight];
    });

    // construct jsnx graph
    var G = new jsnx.Graph ();
    G.addNodesFrom (nodeData);
    G.addEdgesFrom (edgeData);

    // calculate the betweenness centrality
    let betweenness = jsnx.betweennessCentrality (G);

    // size range of the nodes
    let sizeRange = [20, 50];
    let betweennessArray = Object.values (betweenness._numberValues);
    let ratio = Math.max.apply (Math, betweennessArray);

    // community detection using Louvain method
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

    for (let i = 0; i < nodeData.length; i++) {
      // if else to avoid DividedByZero error
      if (ratio > 0) {
        finalDataTemp.nodes.push ({
          label: labels[nodeData[i] - 1],
          id: nodeData[i],
          // put size of node into final data. Size is calculated based on betweenness centrality value
          size: betweennessArray[i] / ratio * (sizeRange[1] - sizeRange[0]) +
            sizeRange[0],
          // put color of node into final data. Color is calculated based on result from community detection
          color: colorBrewer.Set2[nCommunity][result[nodeData[i]]],
          description: [
            ...new Set (networkData[nodeData[i] - 1].subclasses),
          ].join (','),
        });
      } else {
        finalDataTemp.nodes.push ({
          label: labels[nodeData[i] - 1],
          id: nodeData[i],
          // put size of node into final data. Size is calculated based on betweenness centrality value
          size: sizeRange[0],
          // put color of node into final data. Color is calculated based on result from community detection
          color: colorBrewer.Set2[nCommunity][result[nodeData[i]]],
          description: [
            ...new Set (networkData[nodeData[i] - 1].subclasses),
          ].join (','),
        });
      }
    }

    // color the edges based on color of node
    for (let i = 0; i < finalDataTemp.links.length; i++) {
      finalDataTemp.links[i].color =
        colorBrewer.Set2[nCommunity][result[finalDataTemp.links[i].source]];
    }

    // set final data as return data
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

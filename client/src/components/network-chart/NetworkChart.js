import React, {useEffect, useCallback, useRef, useState} from 'react';
import './NetworkChart.css';
import {
  DataSet,
  Network,
  parseGephiNetwork,
} from 'vis-network/standalone/esm/vis-network';
import {range} from 'd3-array';
const similarity = require ('compute-cosine-similarity');
const jsnx = require ('jsnetworkx'); // in Node
const jLouvain = require ('jlouvain');

export default function NetworkChart (props) {
  // A reference to the div rendered by this component
  const domNode = useRef (null);

  // A reference to the vis network instance
  const network = useRef (null);

  const {data} = props;

  // load the JSON file containing the Gephi network.
  // var gephiJSON = require ('./filtered.json'); // code in importing_from_gephi.

  // // you can customize the result like with these options. These are explained below.
  // // These are the default options.
  // var parserOptions = {
  //   edges: {
  //     inheritColor: false,
  //   },
  //   nodes: {
  //     fixed: true,
  //     parseColor: false,
  //   },
  // };

  // // parse the gephi file to receive an object
  // // containing nodes and edges in vis format.
  // var parsed = parseGephiNetwork (gephiJSON, parserOptions);

  // const nodes = new DataSet(parsed.nodes);
  // const edges = new DataSet(parsed.edges);

  // provide data in the normal fashion
  // var data = {
  //   nodes: parsed.nodes,
  //   edges: parsed.edges,
  // };

  // An array of nodes
  //   const nodes = new DataSet ([
  //     {id: 1, label: 'Node 1'},
  //     {id: 2, label: 'Node 2'},
  //     {id: 3, label: 'Node 3'},
  //     {id: 4, label: 'Node 4'},
  //     {id: 5, label: 'Node 5'},
  //   ]);

  // An array of edges
  //   const edges = new DataSet ([
  //     {from: 1, to: 3},
  //     {from: 1, to: 2},
  //     {from: 2, to: 4},
  //     {from: 2, to: 5},
  //   ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const data = {
  //   nodes,
  //   edges,
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    // nodes: {
    //   shape: 'dot',
    //   size: 16,
    // },
    // physics: {
    //   forceAtlas2Based: {
    //     gravitationalConstant: -26,
    //     centralGravity: 0.005,
    //     springLength: 230,
    //     springConstant: 0.18,
    //   },
    //   maxVelocity: 146,
    //   solver: 'forceAtlas2Based',
    //   timestep: 0.35,
    //   stabilization: {iterations: 150},
    // },
  };

  // useEffect (
  //   // () => {
  //   //   network.current = new Network (domNode.current, data, options);
  //   // },
  //   // [domNode, network,data, options]
  // );

  // return <div ref={domNode} />;

  useEffect (
    () => {
      let networkData = data;
      let labels = [];
      let threshold = 0.7;
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

      let finalData = {};
      finalData.nodes = [];
      finalData.links = [];

      let index = 0;
      for (let i = 0; i < labels.length - 1; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          if (networkMatrix[i][j] > 0) {
            index = index + 1;
            finalData.links.push ({
              source: i + 1,
              target: j + 1,
              weight: networkMatrix[i][j],
              id: index,
              description: [...new Set (descriptionMatrix[i][j])].sort (),
            });
          }
        }
      }

      // let node_data = finalData.nodes.map (function (d) {
      //   return d.id;
      // });

      let node_data = [...range (1, labels.length + 1)];
      let edge_data = finalData.links.map (function (d) {
        return [d.source, d.target, d.weight];
      });

      //var G = new jsnx.cycleGraph();
      var G = new jsnx.Graph ();
      G.addNodesFrom (node_data);
      G.addEdgesFrom (edge_data);

      let betweenness = jsnx.betweennessCentrality (G);
      // let eigenvector = jsnx.eigenvectorCentrality (G);
      // let clustering = jsnx.clustering (G);
      let sizeRange = [20, 50];
      let betweennessArray = Object.values (betweenness._numberValues);
      let ratio = Math.max.apply (Math, betweennessArray);
      // let normalized = [];
      // for (let i = 0; i < betweennessArray.length; i++) {
      //   normalized[i] = (betweennessArray[i] / ratio) * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      // }

      for (let i = 0; i < labels.length; i++) {
        finalData.nodes.push ({
          label: labels[i],
          id: i + 1,
          size: betweennessArray[i] / ratio * (sizeRange[1] - sizeRange[0]) +
            sizeRange[0],
        });
      }

      console.log (finalData);
      // https://github.com/jgranstrom/jLouvain/blob/master/example/example.html
    },
    [data]
  );

  return <div>Hello</div>;
}

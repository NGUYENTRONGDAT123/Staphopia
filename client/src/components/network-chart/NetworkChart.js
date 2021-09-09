import React, {useEffect, useCallback, useRef, useState} from 'react';
import './NetworkChart.css';
import {DataSet, Network, parseGephiNetwork} from 'vis-network/standalone/esm/vis-network';

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

  useEffect (
    () => {
      network.current = new Network (domNode.current, data, options);
    },
    [domNode, network,data, options]
  );

  return <div ref={domNode} />;
}

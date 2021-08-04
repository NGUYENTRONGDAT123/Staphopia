// import React, { Component, useEffect } from "react";
// import * as d3 from "d3";
// import classData from "../TestingData/classData";

// export const BubbleChart = (props) => {
//   //hardcode for now
//   const width = 800;
//   const height = 600;

//   // ------------- draw the bubbles ----------------------------//

//   // create a svg container
//   const createSVG = () => {
//     return d3
//       .select("#bubblechart") // id will be bubblechart
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("style", "border: thin red solid")
//       .attr("font-size", 10)
//       .attr("font-family", "sans-serif")
//       .attr("text-anchor", "middle");
//   };

//   function drawChart(svg) {
//     let hierarchalData = makeHierarchy(classData);
//     let packLayout = pack([width - 5, height - 5]);
//     const root = packLayout(hierarchalData);

//     const leaf = svg
//       .selectAll("g")
//       .data(root.leaves())
//       .join("g")
//       .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
//       /// Trigger functions
//       .on("mouseover", showTooltip)
//       .on("mousemove", moveTooltip)
//       .on("mouseleave", hideTooltip);

//     leaf
//       .append("circle")
//       .attr("r", (d) => d.r)
//       .attr("fill-opacity", 0.7)
//       .attr("fill", "navy");

//     leaf.append("clipPath").append("use");

//     // .attr("xlink:href", (d) => d.leafUid.href); //this is for opening new page

//     leaf
//       .append("text")
//       .attr("clip-path", (d) => d.clipUid)
//       .selectAll("tspan")
//       .data((d) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
//       .join("tspan")
//       .attr("x", 0)
//       .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
//       .text((d) => d);
//   }

//   function pack(size) {
//     return d3.pack().size(size).padding(3);
//   }

//   function makeHierarchy(data) {
//     return d3.hierarchy({ children: data }).sum((d) => d.total);
//   }
//   // ----------------------------------------------------------------------//

//   // ----------------------- Create tooltip -----------------------------//

//   const tooltip = d3
//     .select("#bubblechart")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "black")
//     .style("border-radius", "5px")
//     .style("padding", "10px")
//     .style("color", "white");

//   // Show tooltip when hovering mouse on circle
//   function showTooltip(event, d) {
//     tooltip.transition().duration(200);
//     tooltip
//       .style("opacity", 1)
//       .html("Country: " + d.name)
//       .style("left", event.x / 2 + "px")
//       .style("top", event.y / 2 + 30 + "px");
//   }

//   //Move the tooltip when the mouse is still hovering the circle
//   function moveTooltip(event, d) {
//     tooltip
//       .style("left", event.x / 2 + "px")
//       .style("top", event.y / 2 + 30 + "px");
//   }

//   //Hide the tooltip when not hovering the circle
//   function hideTooltip(d) {
//     tooltip.transition().duration(200).style("opacity", 0);
//   }

//   useEffect(() => {
//     let svg = createSVG();
//     drawChart(svg);
//   });

//   return (
//     <div>
//       <h2>Bubble Chart</h2>
//       <div id="bubblechart" />
//     </div>
//   );
// };

import React, { useEffect, useCallback } from "react";
import * as d3 from "d3";

export default function BubbleChart(props) {
  const width = props.width;
  const height = props.height;

  //create svg container

  // const createSVG = () => {
  //   return d3
  //     .select("#bubblechart")
  //     .append("svg")
  //     .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
  //     .style("display", "block")
  //     .style("margin", "0 -14px")
  //     .attr("style", "border: thin red solid")
  //     .style("background", "white")
  //     .style("cursor", "pointer");
  //   // .on("click", (event) => zoom(event, root));
  // };

  const drawChart = useCallback(() => {
    let hierarchalData = makeHierarchy(props.data);
    const layoutPack = pack();
    const root = layoutPack(hierarchalData);
    let focus = hierarchalData;
    let view;

    const color = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    const svg = d3
      .select("#bubblechart")
      .append("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", props.width)
      .attr("height", props.height)
      .style("display", "block")
      .style("margin", "0 -14px")
      .attr("style", "border: thin red solid")
      .style("background", "white")
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, root));

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
      .attr("pointer-events", (d) => (!d.children ? "none" : null))
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#000");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", null);
      })
      .on(
        "click",
        (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
      );

    const label = svg
      .append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .text((d) => d.data.name);

    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      node.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      node.attr("r", (d) => d.r * k);
    }

    function zoom(event, d) {
      // const focus0 = focus;

      focus = d;

      const transition = svg
        .transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", (d) => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return (t) => zoomTo(i(t));
        });

      label
        .filter(function (d) {
          return d.parent === focus || this.style.display === "inline";
        })
        .transition(transition)
        .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
        .on("start", function (d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus) this.style.display = "none";
        });
    }
    return svg.node();
  }, [props.data, height, props.width, props.height, width]);

  function pack() {
    return d3
      .pack()
      .size([500 - 2, 500 - 2])
      .padding(3);
  }

  function makeHierarchy(data) {
    return d3
      .hierarchy({ children: data })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
  }

  useEffect(() => {
    // let svg = createSVG();
    drawChart();
  }, [drawChart]);
  // eslint-disable-next-line

  return (
    <div>
      <h2>Bubble Chart</h2>
      <div id="bubblechart" />
    </div>
  );
}

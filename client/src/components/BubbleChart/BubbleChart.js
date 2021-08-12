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
import { useDispatch } from "react-redux";
import { showAMRTable } from "../../redux/actions/visualization";
import * as d3 from "d3";
import "./BubbleChart.css";
import { PackedCircleData } from "../../API/AMRapi";
import data2 from "../../TestingData/data2";

export default function BubbleChart(props) {
  const width = props.width;
  const height = props.height;
  const dispatch = useDispatch();

  //pack data
  function pack() {
    return d3
      .pack()
      .size([500 - 2, 500 - 2])
      .padding(3);
  }

  //create hierachy of data
  function makeHierarchy(data) {
    return d3
      .hierarchy({ children: data })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
  }

  const color = d3
    .scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  let [data, isLoading] = PackedCircleData();
  //let data = data2;
  let hierarchalData = makeHierarchy(data);
  const layoutPack = pack();
  const root = layoutPack(hierarchalData);
  let focus = hierarchalData;
  let view;

  const drawChart = useCallback(() => {
    //design the container
    const svg = d3
      .select("#bubblechart") //this svg container will be called as id="bubblechart"
      .append("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .attr("style", "border: thin red solid")
      .style("background", "white")
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, root));

    // design the tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white");

    //design the node
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .join("circle")
      .attr("class", function (d) {
        return d.parent
          ? d.children
            ? "node"
            : "node node--leaf _" + d.data.name.replace(".csv", "")
          : "node node--root";
      })
      .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
      .on("mouseover", function (event, d) {
        tooltip
          .html(
            !d.children
              ? "Name: " + d.data.name + "<br>" + "Value: " + d.data.value
              : "Name: " + d.data.name
          )
          .style("visibility", "visible");
        if (!d.children) {
          d3.selectAll("._" + d.data.name.replace(".csv", ""))
            .attr("stroke", "#000")
            .attr("stroke-width", "1.5px");
        }
      })
      .on("mouseout", function (event, d) {
        tooltip.style("visibility", "hidden");
        if (!d.children) {
          d3.selectAll("._" + d.data.name.replace(".csv", "")).attr(
            "stroke",
            "none"
          );
        }
      })
      .on(
        "click",

        (event, d) => {
          if (focus !== d) {
            console.log(d);
            // dispatch(selectSample(d));
            dispatch(showAMRTable(d));
            zoom(event, d);
            event.stopPropagation();
          }
        }
        // {
        //   console.log(d);
        // }
        // focus !== d && (zoom(event, d), event.stopPropagation())
      )
      .on("mousemove", function (event) {
        return tooltip
          .style("left", event.x + 100 + "px")
          .style("top", event.y - 10 + "px");
      });

    //label
    const label = svg
      .append("g")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .text((d) =>
        !d.children ? d.data.name.replace(".csv", "") : d.data.name
      );

    zoomTo([root.x, root.y, root.r * 2]);

    //zoom to
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

    //zoom
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
  }, [color, height, width]);

  //color

  //render again every time there are new data adjusted
  useEffect(() => {
    if (!isLoading) {
      drawChart();
    }
  }, [drawChart, isLoading]);
  // eslint-disable-next-line

  return (
    <div>
      <h2>Bubble Chart</h2>
      <p>
        Each dark green circle represents one type of Antibiotic, each smaller
        white circle represents one sample that has contigs resist to the
        Antibiotics. The size of the Antibiotic circle would be proportional to
        the number of samples that consisted. The circles would be colorized by
        a hue color palette ( dark color for antibiotics with high resistance,
        light color for low resistance ones). When users hover the mouse, the
        circle would be highlighted and when users zoom in the circle bucket,
        more information would be displayed such as details about antibiotics
        and samples.
      </p>
      <div id="bubblechart" />
    </div>
  );
}

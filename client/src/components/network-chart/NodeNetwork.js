// import data from "./data1.json";
import * as d3 from "d3";
import { useRef, useEffect } from "react";
// import "./Network.css";

export default function Network(props) {
  const {
    data,
    distance,
    strength,
    maxDistance,
    name,
    nodeName,
    lineName,
    nodeRatio,
    width1,
    height1,
    xOffset,
  } = props;

  const nodes = data.nodes;
  const links = data.links;

  let zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .on("zoom", function (e) {
      d3.selectAll(`g`).attr("transform", e.transform);
    });

  const drawChart = () => {
    const width = width1;
    const height = height1;
    const svg = d3
      .select(`.${name}`)
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((link) => {
            return link.id;
          })
          .distance(distance)
      )
      .force(
        "charge",
        d3.forceManyBody().strength(strength).distanceMax(maxDistance)
      )
      .force("center", d3.forceCenter(width / 2 + xOffset, height / 2))
      .force(
        "collison",
        d3.forceCollide().radius((d) => d.size)
      );

    //gravity

    const drag = (simulation) => {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    const linkElements = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join(
        (enter) => {
          return enter
            .append("line")
            .attr("class", `${lineName}`)
            .attr("position", "absolute")
            .attr("z-index", 0)
            .attr("stroke-width", 0.5)
            .attr("stroke", "grey");
        },
        (update) =>
          update
            .append("line")
            .attr("class", `${lineName}`)
            .attr("position", "absolute")
            .attr("z-index", 0)
            .attr("stroke-width", 0.5)
            .attr("stroke", "grey"),
        (exit) =>
          exit
            .call((exit) => exit.transition().duration((d, i) => i * 2))
            .remove()
      );

    const nodeElements = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join(
        (enter) => {
          return enter
            .append("circle")
            .attr("class", `${nodeName}`)
            .attr("fill", (d) => d.color)
            .attr("r", (d) => d.size * nodeRatio)
            .attr("stroke-width", 1)
            .style("stroke", "black")
            .attr("position", "absolute")
            .attr("z-index", 1)
            .call(drag(simulation))
            .call((circle) =>
              circle
                .transition()
                .duration((d, i) => i * 2)
                .style("opacity", 1)
            );
        },
        (update) =>
          update
            .append("circle")
            .attr("class", `${nodeName}`)
            .attr("fill", (d) => d.color)
            .attr("r", (d) => d.size * nodeRatio)
            .attr("stroke-width", 1)
            .style("stroke", "black")
            .attr("position", "absolute")
            .attr("z-index", 1)
            .call((circle) => circle.transition())
            .call(drag(simulation)),
        (exit) =>
          exit
            .call((exit) => exit.transition().duration((d, i) => i * 2))
            .remove()
      );

    const lableElements = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join(
        (enter) => {
          return enter
            .append("text")
            .attr("class", "node-text")
            .text((d) => d.label)
            .style("display", (d) => d.label);
        },
        (update) =>
          update
            .append("text")
            .attr("class", "node-text")
            .text((d) => d.label)
            .style("display", (d) => d.label),
        (exit) =>
          exit
            .call((exit) => exit.transition().duration((d, i) => i * 2))
            .remove()
      );

    const ticked = () => {
      lableElements
        .attr("x", (node) => {
          //   console.log(node.x);
          return node.x;
        })
        .attr("y", (node) => node.y);

      nodeElements
        .attr("cx", (node) => {
          //   console.log(node.x);
          return node.x;
        })
        .attr("cy", (node) => node.y);

      linkElements
        .attr("x1", (link) => {
          return link.source.x;
        })
        .attr("y1", (link) => {
          return link.source.y;
        })
        .attr("x2", (link) => link.target.x)
        .attr("y2", (link) => link.target.y);
    };

    simulation.on("tick", ticked);
    return svg.node();
  };

  useEffect(() => {
    d3.selectAll(`.${nodeName}`).remove();
    d3.selectAll(`.${lineName}`).remove();
    d3.selectAll(`.node-text`).remove();
    drawChart();
  }, [data]);

  return <svg className={name} width={"100%"} height={"1500"} />;
}

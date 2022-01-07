import * as d3 from "d3";
import { useEffect } from "react";

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
    selectSample,
  } = props;

  //get the edges and links
  const nodes = data.nodes;
  const links = data.links;

  //pan and zoom event
  let zoom = d3.zoom().on("zoom", function (e) {
    d3.selectAll(`g`).attr("transform", e.transform);
  });

  const drawChart = () => {
    //setting width and height
    const width = width1;
    const height = height1;

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

    //create svg (every elements is in svg) a.k.a container
    const svg = d3.select(`.${name}`).attr("height", height).call(zoom); //allow pan and zoom within svg

    //design simulation
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

    //dragging event
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

    //design links
    const linkElements = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join(
        (enter) => {
          return enter
            .append("line")
            .attr(
              "class",
              (d) =>
                `${lineName} source-${d.source.label} target-${d.target.label}`
            )
            .attr("position", "absolute")
            .attr("z-index", 0)
            .attr("stroke-width", 0.5)
            .attr("stroke", (d) => d.color);
        },
        (update) =>
          update
            .append("line")
            .attr(
              "class",
              (d) =>
                `${lineName} source-${d.source.label} target-${d.target.label}`
            )
            .attr("position", "absolute")
            .attr("z-index", 0)
            .attr("stroke-width", 0.5)
            .attr("stroke", (d) => d.color),
        (exit) =>
          exit
            .call((exit) => exit.transition().duration((d, i) => i * 2))
            .remove()
      );

    //design node
    const nodeElements = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join(
        (enter) => {
          return enter
            .append("circle")
            .attr("class", (d) => `${nodeName} ${d.label}`)
            .attr("fill", (d) => d.color)
            .attr("fill-opacity", 1)
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
            .attr("class", (d) => `${nodeName} ${d.label}`)
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

    //mouse events
    //a list to know which node is connecting to which
    const linkedByIndex = {};
    links.forEach((d) => {
      linkedByIndex[`${d.source.label},${d.target.label}`] = 1;
    });

    // boolean function. It returns true if nodes are connected to each other
    function isConnected(a, b) {
      return (
        linkedByIndex[`${a.label},${b.label}`] ||
        linkedByIndex[`${b.label},${a.label}`] ||
        a.label === b.label
      );
    }

    //initiating mouse events
    nodeElements
      .on("mouseover", (event, d) => {
        tooltip
          .html(() => {
            return `Antibiotics: ${d.description}`;
          })
          .style("visibility", "visible");
        nodeElements
          .style("stroke-opacity", function (o) {
            const thisOpacity = isConnected(d, o) ? 1 : 0.1;
            return thisOpacity;
          })
          .style("fill-opacity", function (o) {
            const thisOpacity = isConnected(d, o) ? 1 : 0.1;
            return thisOpacity;
          });

        linkElements.style("stroke-width", (o) => {
          return o.source.label === d.label || o.target.label === d.label
            ? 2
            : 0.1;
        });
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
        linkElements.style("stroke-width", 0.5);
        nodeElements.style("stroke-opacity", 1).style("fill-opacity", 1);
      })
      .on("mousemove", (event) => {
        return tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 50 + "px");
      })
      .on("click", (event, d) => {
        selectSample(d.label);
      });

    //design lable
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

    //initiate the simulation
    const ticked = () => {
      lableElements
        .attr("x", (node) => {
          //   console.log(node.x);
          return node.x - 9;
        })
        .attr("y", (node) => node.y + 7);

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
    //remove all elements to redraw again
    d3.selectAll("g").remove();
    drawChart();
    // eslint-disable-next-line
  }, [data]);

  return <svg className={name} width={"100%"} height={"1500"} />;
}

import React, { useEffect, useCallback, useRef, useState } from "react";
import * as d3 from "d3";
import "./BubbleChart.css";

export default function BubbleChart(props) {
  const width = props.width;
  const height = props.height;
  const { data, isLoading, selectSample, selectAntibiotic } = props;
  const ref = useRef();

  // const [data, setData] = useState([]);

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

  let hierarchalData = makeHierarchy(data);
  let layoutPack = pack();
  let root = layoutPack(hierarchalData);
  let focus = hierarchalData;
  let view;

  //design the legend
  // const legend = svg.selectAll(".legendItem");

  const drawChart = useCallback(() => {
    //design the container
    const svg = d3
      .select(ref.current) //this svg container will be called as id="bubblechart"
      .append("svg")
      .attr("className", "bb-container")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .attr("style", "border: thin red solid")
      .style("background", "white")
      .style("cursor", "pointer");

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
    // legend
    //   .append("circle")
    //   .attr("cx", width / 2)
    //   .attr("cy", height / 2)
    //   .attr("r", "100px")
    //   .style("fill", "#69b3a2");
    //design the node
    const node = svg
      .selectAll("circle")
      .data(root.descendants())
      .join(
        (enter) => {
          return enter
            .append("circle")
            .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
            .attr("class", function (d) {
              return d.parent
                ? d.children
                  ? "node"
                  : "node node--leaf _" + d.data.name.replace(".csv", "")
                : "node node--root";
            })
            .style("opacity", 0)
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
            .style("opacity", 0)
            .attr("duration", "750")
            .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
            .attr("class", function (d) {
              return d.parent
                ? d.children
                  ? "node"
                  : "node node--leaf _" + d.data.name.replace(".csv", "")
                : "node node--root";
            })
            .call((circle) => circle.transition()),
        (exit) =>
          exit
            .call((exit) => exit.transition().duration((d, i) => i * 2))
            .remove()
      );

    node
      .enter()
      .append("circle")
      .transition()
      .duration(750)
      .attr("class", function (d) {
        return d.parent
          ? d.children
            ? "node"
            : "node node--leaf _" + d.data.name.replace(".csv", "")
          : "node node--root";
      })
      .attr("fill", (d) => (d.children ? color(d.depth) : "white"));

    //mouse events
    let preClick = null;
    node
      .on("mouseover", function (event, d) {
        tooltip
          .html(() => {
            if (!d.children) {
              return (
                "ID: " +
                d.data.name.replace(".csv", "") +
                "<br>" +
                "Number of AMR sequences: " +
                d.data.value
              );
            } else if (d.depth !== 0) {
              return "Name: " + d.data.name;
            }
          })
          .style("visibility", d.depth === 0 ? "hidden" : "visible");
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
      .on("click", (event, d) => {
        if (focus !== d && d.depth !== 2) {
          if (d.depth === 1) {
            selectAntibiotic(d.data.name);
          }
          zoom(event, d);
          event.stopPropagation();
        }

        if (d.depth === 2) {
          selectSample(d.data.name.replace(".csv", ""));
          selectAntibiotic(d.parent.data.name);
          if (preClick !== null) {
            d3.selectAll("._" + preClick).attr(
              "class",
              "node node--leaf _" + preClick
            );
          }
          d3.selectAll("._" + d.data.name.replace(".csv", "")).attr(
            "class",
            "node node--leaf active _" + d.data.name.replace(".csv", "")
          );
          preClick = d.data.name.replace(".csv", "");
        }
      })
      .on("mousemove", (event) => {
        return tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 50 + "px");
      });

    // console.log(root.descendants());
    //label
    const label = svg
      .append("g")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .filter((d) => {
        if (d.data.children !== undefined) {
          if (d.data.children.length !== 0) {
            return d;
          }
        } else {
          return d;
        }
      })
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .attr("text-anchor", "middle")
      .style("display", (d) => {
        //  (d.parent === root ? "inline" : "none")
        if (d.depth === 1 && d.data.children.length === 0) {
          return "none";
        } else if (d.parent === root) {
          return "inline";
        } else {
          return "none";
        }
      })
      .text((d) =>
        !d.children ? d.data.name.replace(".csv", "") : d.data.name
      );
    label.exit().remove();

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
        .style("fill-opacity", (d) => {
          // console.log(d.data);
          if (d.parent === focus) {
            return 1;
          } else {
            return 0;
          }
          //
        })
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

  // render again every time there are new data adjusted
  useEffect(() => {
    if (!isLoading && data) {
      console.log(data);
      d3.selectAll(".node").remove();
      d3.selectAll("text").remove();
      d3.selectAll(".bb-container").remove();
      drawChart();
    }
  }, [data, isLoading]);
  // eslint-disable-next-line

  return (
    <div>
      {/* <>Bubble Chart</  h2> */}
      {/* <p>
        Each dark green circle represents one type of Antibiotic, each smaller
        white circle represents one sample that has contigs resist to the
        Antibiotics. The size of the Antibiotic circle would be proportional to
        the number of samples that consisted. The circles would be colorized by
        a hue color palette ( dark color for antibiotics with high resistance,
        light color for low resistance ones). When users hover the mouse, the
        circle would be highlighted and when users zoom in the circle bucket,
        more information would be displayed such as details about antibiotics
        and samples.
      </p> */}
      <svg className="bubble-chart" ref={ref} width={"100%"} height={"50vh"} />
      {/* <Button onClick={setData(data2)}>Hello</Button> */}
    </div>
  );
}

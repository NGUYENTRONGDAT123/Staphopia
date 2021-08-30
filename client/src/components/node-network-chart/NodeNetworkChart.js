import * as d3 from "d3";
import { useCallback, useEffect, useRef } from "react";
import { data3 } from "../../testing-data/data3";

export default function NodeNetworkChart(props) {
  const { width, height } = props;

  const data = data3;
  // const width = 960;
  // const height = 300;

  const ref = useRef(null);

  //data
  const links = data.links;
  // console.log(links);

  const nodes = data.nodes;
  // console.log(nodes);

  const types = Array.from(new Set(links.map((d) => d.type)));
  // console.log(types);

  //color
  const color = d3.scaleOrdinal(types, d3.schemeCategory10);

  //link arc
  const linkArc = (d) =>
    `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`;

  //container
  const svg = d3
    .select(ref.current)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewbox", [-width / 2, -height / 2, width, height])
    .style("display", "block");

  svg
    .append("defs")
    .selectAll("marker")
    .data(types)
    .join("marker")
    .attr("id", (d) => `arrow-${d}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 38)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", color)
    .attr("d", "M0,-5L10,0L0,5");

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force(
      "collide",
      d3.forceCollide((d) => 65)
    )
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", (d) => color(d.type))
    .attr("marker-end", (d) => `url(#arrow-${d.type})`);

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

  const radius = 25;

  const drawChart = useCallback(() => {
    //draw node
    const node = svg
      .append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("cirle")
      .data(nodes)
      .join("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("r", radius)
      .attr("fill", "#6baed6")
      .call(drag(simulation));

    //mouse event
    node
      .on("mouseover", function (event, d) {
        tooltip.html("Name: " + d.id).style("visibility", "visible");

        console.log(d.id);
      })
      .on("mouseout", function (event, d) {
        tooltip.style("visibility", "hidden");
      })
      .on("click", (e, d) => console.log(d.id))
      .on("mousemove", (event) => {
        return tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 50 + "px");
      });

    simulation.on("tick", () => {
      node
        .attr("cx", (d) => {
          return (d.x = Math.max(radius, Math.min(width - radius, d.x)));
        })
        .attr("cy", (d) => {
          return (d.y = Math.max(radius, Math.min(height - radius, d.y)));
        });

      link
        .attr("d", linkArc)
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });
    });

    return svg.node();
  });

  useEffect(() => {
    drawChart();
  });

  return (
    <svg ref={ref} height={"60vh"} width={"100%"} viewBox="0 0 1000 500" />
  );
}

// import { useEffect, useState } from "react";

// // Hook
// function useScript(src) {
//   // Keep track of script status ("idle", "loading", "ready", "error")
//   const [status, setStatus] = useState(src ? "loading" : "idle");
//   useEffect(
//     () => {
//       // Allow falsy src value if waiting on other data needed for
//       // constructing the script URL passed to this hook.
//       if (!src) {
//         setStatus("idle");
//         return;
//       }
//       // Fetch existing script element by src
//       // It may have been added by another intance of this hook
//       let script = document.querySelector(`script[src="${src}"]`);
//       if (!script) {
//         // Create script
//         script = document.createElement("script");
//         script.src = src;
//         script.async = true;
//         script.setAttribute("data-status", "loading");
//         // Add script to document body
//         document.body.appendChild(script);
//         // Store status in attribute on script
//         // This can be read by other instances of this hook
//         const setAttributeFromEvent = (event) => {
//           script.setAttribute(
//             "data-status",
//             event.type === "load" ? "ready" : "error"
//           );
//         };
//         script.addEventListener("load", setAttributeFromEvent);
//         script.addEventListener("error", setAttributeFromEvent);
//       } else {
//         // Grab existing script status from attribute and set to state.
//         setStatus(script.getAttribute("data-status"));
//       }
//       // Script event handler to update status in state
//       // Note: Even if the script already exists we still need to add
//       // event handlers to update the state for *this* hook instance.
//       const setStateFromEvent = (event) => {
//         setStatus(event.type === "load" ? "ready" : "error");
//       };
//       // Add event listeners
//       script.addEventListener("load", setStateFromEvent);
//       script.addEventListener("error", setStateFromEvent);
//       // Remove event listeners on cleanup
//       return () => {
//         if (script) {
//           script.removeEventListener("load", setStateFromEvent);
//           script.removeEventListener("error", setStateFromEvent);
//         }
//       };
//     },
//     [src] // Only re-run effect if script src changes
//   );
//   return status;
// }

// export default function NodeNetworkChart(props) {
//   const status = useScript("https://public.flourish.studio/resources/embed.js");
//   return (
//     <div
//       class="flourish-embed flourish-network"
//       data-src="visualisation/7075761"
//     >
//       {status === "ready" && (
//         <div onClick={console.log("hello world!")}>
//           Script function call response:
//         </div>
//       )}
//     </div>
//   );
// }

// {
//   /* <div class="flourish-embed flourish-network" data-src="visualisation/7075761">
//   <script src="https://public.flourish.studio/resources/embed.js"></script>
// </div>; */
// }

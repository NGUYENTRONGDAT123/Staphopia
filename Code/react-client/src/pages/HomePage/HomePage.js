import React from "react";
import "./HomePage.css";
import { Panel } from "rsuite";
import { Container, Row, Col } from "react-bootstrap";
import BubbleGraph from "../../image/BubbleGraph.png";
import CircleGraph from "../../image/CircleGraph.png";
import NodeNetwork from "../../image/NodeNetwork.png";

export default function HomePage() {

  return (
    <Container>
      <Panel className="pn">
        <Panel className="pn-header">
          <h1>Staphbook</h1>
          <p>
            This is a website dedicated for data visualizing baterial pathogen -
            Staphyloccocus Aureus
          </p>
          <p>
            We provide tools for scienctists, clinicians and community that
            wants to reasearch Antimicrobial Resistance in Staphyloccocus Aureus
          </p>
        </Panel>
        <Panel className="pn-content">
          <h2>The Tools</h2>
          <Row md={12} className="row-card">
            <Col md={4}>
              <Panel className="card">
                <img src={BubbleGraph} alt="bubble graph" />
                <h2>AMR Bubble Graph</h2>
                <p>
                  The dark green circles indicate the antibiotic medicine. The
                  size will depend on how many samples resistance to that
                  antibiotic. We can also use color to indicate this ass well.
                  The small white circles are sample that contains contigs
                  resistance to that antibiotic. Currently we only show the
                  sample id in circle. Is there any other information about the
                  sample you would like us to show? The size of the white sample
                  circle is decided by how many contigs in the sample resistance
                  to the antibiotic.
                </p>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel className="card">
                <img src={CircleGraph} alt="circle graph" />
                <h2>AMR Circle Graph</h2>
                <p>
                  This graph provides information of certain sequences resistant
                  to specific antibiotics in one sample in Staphopia API. The
                  arrows indicate that the sequences relate to each other and
                  they are in the same assembled contig.
                </p>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel className="card">
                <img src={NodeNetwork} alt="node network" />
                <h2>AMR Node Network</h2>
                <p>
                  The nodes would represent the samples and the edges connect
                  two nodes when the nodes have the same antibiotic resistance.
                  The weight of the edges could be calculated by the number of
                  the same antibiotics found between the two nodes. The users
                  can interact with the graphs, highlight the node and its
                  relationship to view the graph clearly
                </p>
              </Panel>
            </Col>
          </Row>
        </Panel>
      </Panel>
    </Container>
  );
}

import React from "react";
import "./NavBar.css";
import { Navbar, Nav, Container, NavDropdown, NavItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

export function Navigation() {
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="/">Staphbook</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="ml-auto">
            <NavItem>
              <Nav.Link
                href="/"
                className={splitLocation[1] === "" ? "active" : ""}
              >
                Home
              </Nav.Link>
            </NavItem>
            <NavItem>
              <Nav.Link
                href="/AMR"
                className={splitLocation[1] === "AMR" ? "active" : ""}
              >
                AMR Visualization
              </Nav.Link>
            </NavItem>
            <NavItem>
              <Nav.Link
                href="/Search"
                className={splitLocation[1] === "Search" ? "active" : ""}
              >
                Advanced Search
              </Nav.Link>
            </NavItem>
            <NavItem>
              <Nav.Link
                href="/Sample"
                className={splitLocation[1] === "Sample" ? "active" : ""}
              >
                New Sample
              </Nav.Link>
            </NavItem>
            <NavItem>
              <Nav.Link
                href="/Help"
                className={splitLocation[1] === "Help" ? "active" : ""}
              >
                Help/ Tutorial
              </Nav.Link>
            </NavItem>
            <NavItem>
              <NavDropdown
                title={<FontAwesomeIcon icon={faUser} />}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="/">Action</NavDropdown.Item>
                <NavDropdown.Item href="/">Another action</NavDropdown.Item>
                <NavDropdown.Item href="/">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/">Separated link</NavDropdown.Item>
              </NavDropdown>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

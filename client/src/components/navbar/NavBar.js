import React from "react";
import "./NavBar.css";

export default function Navigation() {
  return (
    <nav
      class="navbar navbar-expand-md navbar-light"
      style={{ borderBottom: "0.5px solid gray" }}
    >
      <a
        class="navbar-brand"
        style={{ fontSize: "180%", color: "#2f2f2f" }}
        href="/"
      >
        <i class="fas fa-atom" style={{ color: "#468e94" }}></i> <b>Staph</b>
        Book
      </a>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mx-auto"></ul>

        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <a
              class="nav-link btn btn-sm btn-outline-dark"
              style={{
                marginLeft: "2px",
                marginRight: "2px",
                color: "#468e94",
              }}
              href="/advancedSearch"
            >
              Advanced Search
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link btn btn-sm btn-outline-dark"
              style={{
                marginLeft: "2px",
                marginRight: "2px",
                color: "#468e94",
              }}
              href="/uploadSample"
            >
              New Sample
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link btn btn-sm btn-outline-dark"
              href="/AMR"
              style={{
                marginLeft: "2px",
                marginRight: "2px",
                color: "#468e94",
              }}
            >
              AMR
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link btn btn-sm btn-outline-dark"
              href="/tutorials"
              style={{
                marginLeft: "2px",
                marginRight: "2px",
                color: "#468e94",
              }}
            >
              Help/Tutorial
            </a>
          </li>

          {/* <li class="nav-item">
            <div
              class="dropdown"
              style={{ marginLeft: "auto", marginRight: "30px" }}
            >
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-user"></i>
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="/favourites">
                  Favourites
                </a>
                <a class="dropdown-item" href="/groups">
                  Groups
                </a>
                <a class="dropdown-item" href="/logout">
                  Logout
                </a>
              </div>
            </div>
          </li> */}

          <li class="nav-item">
            <a
              class="btn btn-sm btn-dark nav-link"
              style={{ marginLeft: "2px", marginRight: "2px", color: "white" }}
              href="/login"
            >
              Log in / Register
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

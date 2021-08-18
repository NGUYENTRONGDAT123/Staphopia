import React from 'react';
import './NavBar.css';
import {Navbar, Nav, Container, NavDropdown, NavItem} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {Layout, Menu, Breadcrumb} from 'antd';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

const {SubMenu} = Menu;
const {Header, Content, Footer, Sider} = Layout;

export default function Navigation () {
  //assigning location variable
  // const location = useLocation ();

  // //destructuring pathname from location
  // const {pathname} = location;

  // //Javascript split method to get the name of the path in array
  // const splitLocation = pathname.split ('/');

  return (
    // <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
    //   <Container>
    //     <Navbar.Brand href="/">Staphbook</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse className="justify-content-end">
    //       <Nav className="ml-auto">
    //         <NavItem>
    //           <Nav.Link
    //             href="/"
    //             className={splitLocation[1] === "" ? "active" : ""}
    //           >
    //             Home
    //           </Nav.Link>
    //         </NavItem>
    //         <NavItem>
    //           <Nav.Link
    //             href="/AMR"
    //             className={splitLocation[1] === "AMR" ? "active" : ""}
    //           >
    //             AMR Visualization
    //           </Nav.Link>
    //         </NavItem>
    //         <NavItem>
    //           <Nav.Link
    //             href="/Search"
    //             className={splitLocation[1] === "Search" ? "active" : ""}
    //           >
    //             Advanced Search
    //           </Nav.Link>
    //         </NavItem>
    //         <NavItem>
    //           <Nav.Link
    //             href="/Sample"
    //             className={splitLocation[1] === "Sample" ? "active" : ""}
    //           >
    //             New Sample
    //           </Nav.Link>
    //         </NavItem>
    //         <NavItem>
    //           <Nav.Link
    //             href="/Help"
    //             className={splitLocation[1] === "Help" ? "active" : ""}
    //           >
    //             Help/ Tutorial
    //           </Nav.Link>
    //         </NavItem>
    //         <NavItem>
    //           <NavDropdown
    //             title={<FontAwesomeIcon icon={faUser} />}
    //             id="basic-nav-dropdown"
    //           >
    //             <NavDropdown.Item href="/">Action</NavDropdown.Item>
    //             <NavDropdown.Item href="/">Another action</NavDropdown.Item>
    //             <NavDropdown.Item href="/">Something</NavDropdown.Item>
    //             <NavDropdown.Divider />
    //             <NavDropdown.Item href="/">Separated link</NavDropdown.Item>
    //           </NavDropdown>
    //         </NavItem>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>

    (
      // <Router>
      //   <Layout>
      //     <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      //       <Menu.Item key="1">
      //         <span>Home</span>
      //         <Link to="/" />
      //       </Menu.Item>
      //       <Menu.Item key="2">
      //         <span>AMR</span>
      //         <Link to="/AMR" />
      //       </Menu.Item>
      //     </Menu>

      //     <Layout>
      //       <Header style={{background: '#fff', padding: 0, paddingLeft: 16}} />
      //       <Content
      //         style={{
      //           margin: '24px 16px',
      //           padding: 24,
      //           background: '#fff',
      //           minHeight: 280,
      //         }}
      //       >
      //         <Route exact path="/" component={Dashboard} />
      //         <Route path="/AMR" component={Meseros} />
      //       </Content>
      //       <Footer style={{textAlign: 'center'}}>
      //         Ant Design ©2016 Created by Ant UED
      //       </Footer>
      //     </Layout>

      //   </Layout>
      // </Router>

      <div></div>
    )
  );
}

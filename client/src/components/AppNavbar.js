import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from 'reactstrap';
import { Link } from 'react-router-dom';

class AppNavbar extends Component {
  state = {
    isOpen: false,
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
          <Container>
            <NavbarBrand style= {{ color: "antiquewhite" }}>ELA</NavbarBrand>
            <NavbarBrand>
              <Link style={{ color: "#E4E4E4", textDecoration: "none"}} to="/">File Upload</Link></NavbarBrand>
            <NavbarBrand>
              <Link style={{ color: "#E4E4E4", textDecoration: "none"}} to="/search">Search</Link>
              </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink style= {{ color: "antiquewhite" }}>
                    NYU
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
}

export default AppNavbar;
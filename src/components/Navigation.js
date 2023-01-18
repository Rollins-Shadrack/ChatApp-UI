import React from 'react'
import {useLogoutUserMutation} from '../services/appApi'
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";


const Navigation = () => {
    const user = useSelector((state)=>state.user)
    const [logoutUser] = useLogoutUserMutation();


    const handleLogout = async(e) =>{
        e.preventDefault();
        await logoutUser(user);
        // redirect to home page
        window.location.replace("/");
    }
return (
    <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <img src={logo} style={{ width: "60px", height: "60px" }} />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!user &&
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>}
                        <LinkContainer to="/chat">
                            <Nav.Link>Chat</Nav.Link>
                        </LinkContainer>
                            {user && <NavDropdown 
                                title={
                                    <>
                                        <img src={`https://therapychat.herokuapp.com/files/${user.picture}`} style={{ width: 40, height: 40, marginRight: 10, objectFit: "cover", borderRadius: "50%" }}  alt="" />
                                        {user.name}
                                    </>
                                }
                                id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">
                                <LinkContainer to="/posts">
                                <Nav.Link>Posts</Nav.Link>
                                </LinkContainer>
                                </NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Button variant="danger" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </NavDropdown.Item>
                            </NavDropdown>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}

export default Navigation
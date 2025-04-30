import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function AppNavbar() {
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Container>
                <Navbar.Brand href="/">Chess&nbsp;Game</Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link href="/">Início</Nav.Link>
                        <Nav.Link href="/sobre">Sobre</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
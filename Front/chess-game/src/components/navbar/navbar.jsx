import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function AppNavbar() {
    return (
        <Navbar bg="dark" variant="dark" expand="md" className='mb-3'>
            <Container>
                <Navbar.Brand href="/">Chess&nbsp;Game</Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="#contact">Contato</Nav.Link>
                        <Nav.Link href="#ranking">Ranking</Nav.Link>
                        <Nav.Link href="#about">Sobre</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
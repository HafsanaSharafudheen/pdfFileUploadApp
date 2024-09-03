import React from 'react';
import { useNavigate } from 'react-router';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
    email?: string; 
}

const Header: React.FC<HeaderProps> = ({ email }) => {
    const navigate = useNavigate();
    const defaultProfilePicture = 'https://img.freepik.com/premium-vector/business-global-economy_24877-41082.jpg?w=740';
   
    const handleProfileClick = () => {
        navigate('/profile',{state:{email}});
    };

    return (
        <Navbar expand="lg" className='navbar'>
            <Navbar.Brand as ={NavLink} to="/home" className='mediflowText'>UploadMyPDF</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" role="navigation">
                <Nav className="ms-auto">
                    <Nav.Link as ={NavLink} to="/home">Home</Nav.Link>
                    <Nav.Link as ={NavLink} to="/YourFiles">Your Files</Nav.Link>

                    <Nav.Link as ={NavLink} to="/aboutUs">About Us</Nav.Link>
                    
                    <div className='d-flex align-items-center'>
                        <img
                            src={defaultProfilePicture}
                            alt="Profile"
                            className='profileImage'
                            onClick={handleProfileClick}
                        />
                       
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;

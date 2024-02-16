import './Header.css';
import logo from '../../Images/logo/IvaPharmLogo.jpg';
import location from '../../Images/pin.png';
import user from '../../Images/user.png';
import cart from '../../Images/shopping-cart.png';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () =>{
    return(
        <div className='container-fluid'>
            <div className="container-fluid header">
                <div className="logo">
                    <img src={logo} alt="" className='logoImg'/>
                </div>
                <div className="search">
                    <Form className='d-flex w-100'>
                        <Form.Control 
                            type='search'
                            placeholder='Pretraga...'
                            className='me-2'
                            aria-label='Search'    
                        />
                        <Button variant='outline-success'>
                            Pretraži
                        </Button>
                    </Form>
                </div>

                <div className="login">
                    <div className="location">
                        <img src={location} alt="Location" className='imgLocation'/>
                        <div className="locationP">
                            <p>Lokacije</p>
                        </div>
                    </div>

                    <Link to={"/user/login"} className='user'>
                        <img src={user} alt="User" className='imgUser'/>
                        <div className="userP">
                            <p>Prijava</p>
                        </div>
                    </Link>

                    <div className="cart">
                        <img src={cart} alt="Korpa" className='imgKorpa'/>
                        <div className="korpaP">
                            <p>Korpa</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="search-mobile">
                <Form className='d-flex w-85 mt-3'>
                    <Form.Control 
                        type='search'
                        placeholder='Pretraga...'
                        className='me-2'
                        aria-label='Search'
                    />
                    <Button variant='outline-success'>Pretraži</Button>
                </Form>
            </div>
        </div>
    )
}

export default Header;
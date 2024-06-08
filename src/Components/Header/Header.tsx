import './Header.css';
import logo from '../../Images/logo/IvaPharmLogo.jpg';
import location from '../../Images/pin.png';
import user from '../../Images/user.png';
import cart from '../../Images/shopping-cart.png';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Cart } from '../Cart/Cart';
import { useEffect, useState } from 'react';

const Header = () =>{

    const[isLoggedIn, setLogin] = useState<boolean>(false);

    useEffect(()=>{
        const token = localStorage.getItem('api_token_user');
        setLogin(!!token);
    })

    return(
        <div className='container-fluid mb-2'>
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
                        <Button variant='outline-success '>
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

                    {isLoggedIn ? (
                        <Link to={"/user/profile"} className='user'>
                            <img src={user} alt="User" className='imgUser'/>
                            <div className="userP">
                                <p>Moj profil</p>
                            </div>
                        </Link>
                    ) : (
                        <Link to={"/user/login"} className='user'>
                            <img src={user} alt="User" className='imgUser'/>
                            <div className="userP">
                                <p>Prijava</p>
                            </div>
                        </Link>
                    )}

                    

                    <div className="cart">
                        <Cart/>
                        <div className="korpaP">
                            <p>Korpa</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="search-mobile">
                <Form className='d-flex mt-3'>
                    <Form.Control 
                        type='search'
                        placeholder='Pretraga...'
                        className='me-2'
                        aria-label='Search'
                    />
                    <Button variant='outline-success '>Pretraži</Button>
                </Form>
            </div>
        </div>
    )
}

export default Header;
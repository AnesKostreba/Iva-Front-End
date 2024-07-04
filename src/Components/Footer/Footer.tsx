import './Footer.css'
import logo from '../../Images/logo/IvaPharmLogo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstitution } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
export const Footer = () =>{
    return(
        <>
        <div className='footer d-flex'>
            <div className='firstFooter'>
                
                <h4>Iva Pharm</h4>
                
                <ul className='ulList'>
                    <li>O nama</li>
                    <li>Pitaj farmaceuta</li>
                    <li>Blog</li>
                    <li>Poslovnice</li>
                    <li>Zaposlenje</li>
                    <li>Kontakt</li>
                </ul>
            </div>
            <div className='secoundFooter'>
                <h4>Korisnički servis</h4>
                <ul>
                    <li>Isporuka i plaćanje</li>
                    <li>Reklamacije</li>
                    <li>Zahtev za reklamaciju</li>
                    <li>Pravila i uslovi korišćenja PITAJ FARMACEUTA</li>
                </ul>
            </div>
            <div className='thirdFooter'>
                <h4>Pratite nas</h4>
                <Link to='#' className='align-items-center d-flex '>
                    <FontAwesomeIcon size='2x' icon={faInstagram} className='faSocial'/> apoteka_iva_pharm
                </Link>   
                <Link to='#' className='align-items-center d-flex mt-2'>
                    <FontAwesomeIcon size='2x' className='faSocial' icon={faFacebook}/>apoteka_iva_pharm
                </Link>       
            </div>
            
        </div>
        <div className='text-center created'>
                <p>Created by: <Link to='#'>Vebista</Link></p>
            </div>
        </>
    )
}
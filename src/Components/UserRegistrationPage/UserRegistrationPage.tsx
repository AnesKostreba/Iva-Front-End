import { useState } from 'react';
import './UserRegistrationPage.css';
import api, { ApiResponse, getRole, Role } from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { RoledMainMenu } from '../RoledMainMenu/RoledMainMenu';

interface UserRegistrationPage{
    formData?:{
        email?: string;
        password?: string;
        forname?: string;
        surname?: string;
        phone?: string;
        address?: string;
    };
    fieldErrors?: {
        email?: string;
        password?: string;
        forname?: string;
        surname?: string;
        phone?: string;
        address?: string;
    };

    message?: string;

    isRegistrationComplete: boolean;

}

export const UserRegistrationPage = () =>{
    const[userState, setUserState] = useState<UserRegistrationPage>({
        formData:{
            email: '',
            password: '',
            forname: '',
            surname: '',
            phone: '',
            address: ''
        },
        fieldErrors: {},
        isRegistrationComplete: false,
    })

    const formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const {id, value} = event.target;
        setUserState((prevState)=> ({
            ...prevState,
            formData: {
                ...prevState.formData,
                [id]: value,
            },
        }));
    };

    const doRegister = () =>{
        const errors: any = {};

        if (!userState.formData?.email) {
            errors.email = 'Email je obavezan.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userState.formData.email)) {
            errors.email = 'Email format nije ispravan.';
        }

        if (!userState.formData?.password || userState.formData.password.length < 6) {
            errors.password = 'Lozinka mora imati 6 karaktera.';
        }

        if (!userState.formData?.forname) {
            errors.forname = 'Ime je obavezno.';
        }

        if (!userState.formData?.surname) {
            errors.surname = 'Prezime je obavezno.';
        }

        if (!userState.formData?.phone) {
            errors.phone = 'Broj telefona je obavezan.';
        }

        if (!userState.formData?.address) {
            errors.address = 'Adresa je obavezna.';
        }

        if (!userState.formData?.phone) {
        errors.phone = 'Broj telefona je obavezan.';
        } else if (!/^\+\d{8,15}$/.test(userState.formData.phone)) {
        errors.phone = 'Broj telefona mora biti u formatu +38XXXXXXXX.';
        }

        if (!userState.formData?.address) {
        errors.address = 'Adresa je obavezna.';
        } else if (userState.formData.address.length < 10) {
        errors.address = 'Adresa mora imati najmanje 10 karaktera.';
        }


        // Ako ima grešaka:
        if (Object.keys(errors).length > 0) {
            setUserState((prevState) => ({
            ...prevState,
            fieldErrors: errors,
            message: '', // nema generalne poruke
            }));
            return; // prekini
        }

        // Ako je sve ok, očisti error-e
        setUserState((prevState) => ({
            ...prevState,
            fieldErrors: {},
            message: '',
        }));
        const data = {
            email: userState.formData?.email,
            password: userState.formData?.password,
            forname: userState.formData?.forname,
            surname: userState.formData?.surname,
            phoneNumber: userState.formData?.phone,
            postalAddress: userState.formData?.address
        }
        api('auth/user/register/','post',data,true)
            .then((res? : ApiResponse)=>{
                if(res?.data.statusCode !== undefined){
                    handleErrors(res.data);
                    return;
                }
                if(res?.status === 'error'){
                    setErrorMessage('Unesite odgovarajuce podatke!');
                    return;
                }
                
                registrationComplete();
            })
    }

    const handleErrors = (data: any) => {
        const errors: any = {};

        switch (data.statusCode) {
            case -6002:
            errors.email = 'Ovaj email već postoji u bazi.';
            break;
            case -6003:
            errors.phone = 'Ovaj broj telefona već postoji u bazi.';
            break;
            default:
            setErrorMessage('Neočekivana greška.');
            return;
        }

        setUserState((prevState) => ({
            ...prevState,
            fieldErrors: errors,
            message: '',
        }));
        };


    const setErrorMessage = (message: string) =>{
        setUserState(prevState =>({
            ...prevState,
            message: message
        }))
    }

    const navigate = useNavigate();
    const registrationComplete = () =>{
        setUserState(prevState => ({
            ...prevState,
            isRegistrationComplete: true
        }))
        navigate('/user/login')
    }

    const renderForm = ()=>{
        return(
            <div className="loginPage container-fluid d-flex flex-direction-row mt-4 justify-content-center">
            <div className=" bg-danger first">
                <div className="overly"></div>
                <div className="content ">
                    <h3 className="contentText">Dobro došli!</h3>
                    <h5 className="">Registrujte se i kupujte lakše!</h5>
                </div>
            </div>
            
            <div className='containerSecound'>
                <div className="center">
                    <form method="post" action="">
                        <h1>Registruj se</h1>
                        <div className="text_field">
                            <label htmlFor="email">Email</label><br />
                            <input placeholder='unesite email...' type="email" id="email" required
                                                                value={userState.formData?.email}
                                                                onChange={event => formInputChanged(event as any)} />
                        {userState.fieldErrors?.email && (
                            <p className="field-error">{userState.fieldErrors.email}</p>
                        )}
                        </div>
                        
                        <div className="text_field">
                            <label htmlFor="forname">Ime</label><br />
                            <input placeholder='unesite ime...' type="text" id="forname" required
                                                                value={userState.formData?.forname}
                                                                onChange={event => formInputChanged(event as any)} />
                        {userState.fieldErrors?.forname && (
                            <p className="field-error">{userState.fieldErrors.forname}</p>
                        )}
                        </div>
                        <div className="text_field">
                            <label htmlFor="surname">Prezime</label><br />
                            <input placeholder='unesite prezime...' type="text" id="surname" required
                                                                value={userState.formData?.surname}
                                                                onChange={event => formInputChanged(event as any)} />
                            {userState.fieldErrors?.surname && (
                            <p className="field-error">{userState.fieldErrors.surname}</p>
                        )}
                        </div>
                        <div className="text_field">
                            <label htmlFor="phone">Broj telefona</label><br />
                            <input placeholder='unesite broj telefona...' type="phone" id="phone" required
                                                                value={userState.formData?.phone}
                                                                onChange={event => formInputChanged(event as any)} /><br/>
                            <label className='labell' htmlFor="phone">(Unesite broj telefona u sledećem formatu: +38XXXXXXXX)</label><br />
                            {userState.fieldErrors?.phone && (
                            <p className="field-error">{userState.fieldErrors.phone}</p>
                        )}
                        </div>
                        <div className="text_field">
                            <label htmlFor="password">Lozinka</label><br />
                            <input placeholder='unesite lozinku...' type="password" id="password" required
                                                                value={userState.formData?.password}
                                                                onChange={event => formInputChanged(event as any)}  /><br/>
                            <label className='labell' htmlFor="password">(Lozinka mora sadržati malo slovo i najmanje 6 karaktera...)</label>
                            {userState.fieldErrors?.password && (
                            <p className="field-error">{userState.fieldErrors.password}</p>
                        )}
                        </div>
                        <div className="text_field">
                            <label htmlFor="address">Adresa</label><br />
                            <textarea placeholder='unesite adresu...' id="address" rows={3}
                                                                value={userState.formData?.address}
                                                                onChange={event => formInputChanged(event as any)} />
                            {userState.fieldErrors?.address && (
                            <p className="field-error">{userState.fieldErrors.address}</p>
                        )}
                        </div>
                        <Alert variant="danger"
                            className= {`registracija ${userState.message ? 'alert-danger' : 'd-none'}`}>
                            { userState.message }
                        </Alert>
                        <Button className="submit" variant="primary"
                                onClick={ ()=> { doRegister() } }>
                            Registruj se
                        </Button>
                       
                    </form>
                    
                </div>
                
            </div>
            
        </div>
        )
    }
    const renderRegistrationCompleteMessage = ()=>{
        return(
            <div>
                <p>
                    Uspesno ste se registrovali.<br/>
                    <Link to='/user/login'>Kliknite ovde</Link>
                    da biste se ulogovali.
                </p>
            </div>
        )
    }


    return(
        
          <div>
            <RoledMainMenu role='user'/>
                {userState.isRegistrationComplete === false ? renderForm() : renderRegistrationCompleteMessage()}
          </div>
    )
}
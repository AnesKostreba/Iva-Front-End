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
                if(res?.status === 'error'){
                    setErrorMessage('Unesite odgovarajuce podatke!');
                    return;
                }
                if(res?.data.statusCode !== undefined){
                    handleErrors(res.data);
                    return;
                }
                registrationComplete();
            })
    }

    const handleErrors = (data: any) =>{
        let message = '';

        switch(data.statusCode){
            case -6001: message = 'This account already exists!';
            break;
        }

        setErrorMessage(message)
    }

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
            
            <div>
                <div className="center">
                    <form method="post" action="">
                        <h1>Registruj se</h1>
                        <div className="text_field">
                            <label htmlFor="email">Email</label><br />
                            <input placeholder='unesite email...' type="email" id="email" required
                                                                value={userState.formData?.email}
                                                                onChange={event => formInputChanged(event as any)} />
                        </div>
                        
                        <div className="text_field">
                            <label htmlFor="forname">Ime</label><br />
                            <input placeholder='unesite ime...' type="text" id="forname" required
                                                                value={userState.formData?.forname}
                                                                onChange={event => formInputChanged(event as any)} />
                        </div>
                        <div className="text_field">
                            <label htmlFor="surname">Prezime</label><br />
                            <input placeholder='unesite prezime...' type="text" id="surname" required
                                                                value={userState.formData?.surname}
                                                                onChange={event => formInputChanged(event as any)} />
                        </div>
                        <div className="text_field">
                            <label htmlFor="phone">Broj telefona</label><br />
                            <input placeholder='unesite broj telefona...' type="phone" id="phone" required
                                                                value={userState.formData?.phone}
                                                                onChange={event => formInputChanged(event as any)} /><br/>
                            <label className='labell' htmlFor="phone">(Unesite broj telefona u sledećem formatu: +38XXXXXXXX)</label><br />
                        </div>
                        <div className="text_field">
                            <label htmlFor="password">Lozinka</label><br />
                            <input placeholder='unesite lozinku...' type="password" id="password" required
                                                                value={userState.formData?.password}
                                                                onChange={event => formInputChanged(event as any)}  /><br/>
                            <label className='labell' htmlFor="password">(Lozinka mora sadrzati veliko slovo, malo slovo, broj i znak, i ukupno 6 karaktera...)</label>
                        </div>
                        <div className="text_field">
                            <label htmlFor="address">Adresa</label><br />
                            <textarea placeholder='unesite adresu...' id="address" rows={3}
                                                                value={userState.formData?.address}
                                                                onChange={event => formInputChanged(event as any)} />
                        </div>
                        
                        <Button className="submit" variant="primary"
                                onClick={ ()=> { doRegister() } }>
                            Registruj se
                        </Button>
                       
                    </form>
                    
                </div>
                <Alert variant="danger"
                       className= {userState.message ? 'alert-danger' : 'd-none'}>
                       { userState.message }
                </Alert>
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
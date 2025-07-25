import { useState } from 'react';
import './UserLoginPage.css'
import { Link, useNavigate } from 'react-router-dom';
import api, { ApiResponse, getRole, Role, saveRefreshToken, saveToken } from '../../api/api';
import { Alert, Button } from 'react-bootstrap';
import { RoledMainMenu } from '../RoledMainMenu/RoledMainMenu';

interface UserLoginPageState{
    email: string;
    password: string;
    fieldErrors: {
        email?: string;
        password?: string;
    };
    errorMessage: string;
    // isLoggedIn: boolean;
}

export const UserLoginPage = () =>{
    const role: Role = getRole();
    const [userState, setStateUser] = useState<UserLoginPageState>(
        {
            email: '',
            password: '',
            errorMessage: '',
            fieldErrors: {
                email: "",
                password: "",
            }
            // isLoggedIn: false,
        }
    )
    console.log('Current error message',userState.errorMessage)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    const formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const {id, value} = event.target;
        setStateUser(prevState =>({
            ...prevState,
            [id]: value
        }))
    }



    const setErrorMessage = (message: string)=>{
        setStateUser(prevState=>({
            ...prevState,
            errorMessage: message
        }))
    }

    // const setLogginState = (isLoggedIn: boolean) =>{
    //     setIsLoggedIn(prevState =>({
    //         ...prevState,
    //         isLoggedIn: isLoggedIn
    //     }))
    // }

    const doLogin = () => {
        const fieldErrors: any = {};

        if (!userState.email) {
            fieldErrors.email = 'Email je obavezan.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userState.email)) {
            fieldErrors.email = 'Email format nije ispravan.';
        }
        if(userState.password.length < 6){
            fieldErrors.password = 'Lozinka mora biti duza od 6 karaktera.';
        }

        if (!userState.password) {
            fieldErrors.password = 'Lozinka je obavezna.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            setStateUser((prev) => ({
            ...prev,
            fieldErrors,
            errorMessage: ''
            }));
            return;
        }

        // Ako je ok — resetuj field greške
        setStateUser((prev) => ({
            ...prev,
            fieldErrors: {},
            errorMessage: ''
        }));
        api('auth/user/login', 'post', {
            email: userState.email,
            password: userState.password,
        }, true)
        .then((res?: ApiResponse) => {
            if (!res) {
                console.log('No response received!');
                setErrorMessage('No response from server!');
                return;
            }
    
            console.log('Response received:', res);
    
            if (res.status === 'error') {
                console.log('Error status received:', res);
                if (res.data && res.data.statusCode !== undefined) {
                    let message = '';
                    switch (res.data.statusCode) {
                        case -3001: message = 'Uneli ste pogrešan email';
                            break;
                        case -3002: message = 'Uneli ste pogrešnu lozinku';
                            break;
                        default: message = 'Unesite podatke';
                    }
                    console.log('Error statusCode:', res.data.statusCode, 'Message:', message);
                    setErrorMessage(message);
                } else {
                    setErrorMessage('Unesite ispravno podatke i pokušajte ponovo!');
                }
                return;
            }
    
            if (res.status === 'ok') {
                console.log('Status OK, checking data!');
                if (res.data.statusCode !== undefined) {
                    console.log('Response data:', res.data);
                    let message = '';
                    switch (res.data.statusCode) {
                        case -3001: message = 'Uneli ste pogrešan email';
                            break;
                        case -3002: message = 'Uneli ste pogrešnu lozinku';
                            break;
                        default: message = 'Unexpected error occurred!';
                    }
                    console.log('Error statusCode:', res.data.statusCode, 'Message:', message);
                    setErrorMessage(message);
                    return;
                }
                saveToken('user', res.data.token);
                saveRefreshToken('user', res.data.refreshToken);
                localStorage.setItem('user_id', res.data.id);
                setIsLoggedIn(true);
                navigate('/');
            }
        })
        .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
            let message = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(' ')
            : error.response.data.message;

            setStateUser((prev) => ({
            ...prev,
            errorMessage: message,
            }));
        } else {
            setStateUser((prev) => ({
            ...prev,
            errorMessage: 'Došlo je do greške. Pokušajte ponovo.'
            }));
        }
        });
    }
    

    return(
        <>
        <RoledMainMenu role='user'/>
        <div className="loginPage container-fluid d-flex flex-direction-row mt-4 justify-content-center">
            
            <div className=" bg-danger first">
                <div className="overly"></div>
                <div className="content ">
                    <h3 className="contentText">Dobro došli!</h3>
                    <h5 className="">Uloguj se i kupujte lakše!</h5>

                </div>
            </div>
            
            <div className="secound d-flex flex-column" >
                <div className="center">
                    <form method="post" action="">

                        <h1>Prijavi se</h1>
                        <div className="text_field">
                            <label htmlFor="email">Email</label><br />
                            <input placeholder='unesite email...' type="email" id="email" 
                                                                required
                                                                value={userState.email}
                                                                onChange={event => formInputChanged(event as any)
                                                                }
                                                                />
                            {userState.fieldErrors?.email && (
                                <p className="field-error">{userState.fieldErrors.email}</p>
                            )}
                        </div>
                        <div className="text_field">
                            <label htmlFor="password">Lozinka</label><br />
                            <input placeholder='unesite lozinku...' type="password" id="password" 
                                                                className='password-input'
                                                                value={userState?.password}
                                                                required
                                                                onChange={event => formInputChanged(event as any)}  />
                            {userState.fieldErrors?.password && (
                                <p className="field-error">{userState.fieldErrors.password}</p>
                            )}
                        </div>
                        <Alert variant="danger" className={`customAlert ${userState.errorMessage ? '' : 'd-none'}`}>
                            {userState.errorMessage}
                        </Alert>
                        <div className="pass">Zaboravili ste lozinku?</div>
                        
                        <Button type='button' className="submit" variant="primary"
                                onClick={ ()=> doLogin() }>
                            Prijavi se
                        </Button>
                        <div className="signup_link">Niste registrovani? <Link to={'/user/register'}>Registruj se</Link></div>
                    </form>
                    
                </div>
            </div>
        </div>
        </>
    )
}
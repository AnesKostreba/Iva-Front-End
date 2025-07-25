import { useState } from 'react';
import './AdministratorLoginPage.css'
import { Link, useNavigate } from 'react-router-dom';
import api, { ApiResponse, getRole, Role, saveIdentity, saveRefreshToken, saveToken } from '../../api/api';
import { Alert, Button } from 'react-bootstrap';
import { RoledMainMenu } from '../RoledMainMenu/RoledMainMenu';

interface AdministratorLoginPageState{
    username: string;
    password: string;
    fieldErrors: {
        username?: string;
        password?: string;
    };
    errorMessage: string;
}

export const AdministratorLoginPage = () =>{
    const role: Role = getRole();
    const [userState, setStateUser] = useState<AdministratorLoginPageState>(
        {
            username: '',
            password: '',
            fieldErrors: {
                username: "",
                password: ""
            },
            errorMessage: '',
        }
    )
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
    
    const doLogin = () =>{

        const errors: any = {};

        if (!userState.username) {
            errors.username = 'Korisničko ime je obavezno.';
        } else if (userState.username.length < 5) {
            errors.username = 'Korisničko ime mora imati najmanje 5 karaktera.';
        }

        if (!userState.password) {
            errors.password = 'Lozinka je obavezna.';
        } else if (userState.password.length < 6) {
            errors.password = 'Lozinka mora imati najmanje 6 karaktera.';
        }

        if (Object.keys(errors).length > 0) {
            setStateUser(prev => ({
            ...prev,
            fieldErrors: errors,
            errorMessage: '',
            }));
            return;
        }

        // Ako je sve OK, očisti error-e
        setStateUser(prev => ({
            ...prev,
            fieldErrors: {},
            errorMessage: '',
        }));

        
        api('auth/administrator/login', 'post', {
            username: userState.username,
            password: userState.password,
            }, true)
            .then((res?: ApiResponse) => {
            if (!res) {
                console.log('No response receive!');
                return;
            }

            if (res.status === 'error') {
                console.log('Backend error:', res);

                if (res.data && res.data.errorCode === "error" && res.data.statusCode < 0) {
                let message = '';

                switch (res.data.statusCode) {
                    case -3001: message = 'Nepoznat username!'; break;
                    case -3002: message = 'Pogrešna lozinka!'; break;
                    default: message = 'Greška! Pokušajte ponovo.';
                }

                setErrorMessage(message);
                } else {
                setErrorMessage('System error... Try again!');
                }

                return;
            }

            if (res.status === 'ok') {
                saveToken('administrator', res.data.token);
                saveRefreshToken('administrator', res.data.refreshToken);
                setIsLoggedIn(true);
                navigate('/administrator/dashboard');
            }
            });

        
    }

    return(
        <>
        <RoledMainMenu role='administrator'/>
        <div className="loginPage container-fluid d-flex flex-direction-row mt-4 justify-content-center">
            
            <div className="secound">
                <div className="center">
                    <form method="post" action="">

                        <h1>Prijavi se</h1>
                        <div className="text_field">
                            <label htmlFor="username">Username</label><br />
                            <input placeholder='unesite username...' type="text" id="username" required
                                                                value={userState.username}
                                                                onChange={event => formInputChanged(event as any)} />
                            {userState.fieldErrors.username && (
                                <p className="field-error">{userState.fieldErrors.username}</p>
                            )}
                        </div>
                        <div className="text_field">
                            <label htmlFor="password">Lozinka</label><br />
                            <input placeholder='unesite lozinku...' type="password" id="password" required
                                                                value={userState?.password}
                                                                onChange={event => formInputChanged(event as any)}  />
                            {userState.fieldErrors.password && (
                                <p className="field-error">{userState.fieldErrors.password}</p>
                            )}
                        </div>
                        <Alert variant="danger" className={userState.errorMessage ? '' : 'd-none'}>
                        {userState.errorMessage}
                    </Alert>
                        <Button className="submit" variant="primary"
                                onClick={ ()=> doLogin() }>
                            Prijavi se
                        </Button>
                        
                    </form>
                    
                </div>
                
            </div>
        </div>
        </>
    )
}
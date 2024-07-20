import { useState } from 'react';
import './AdministratorLoginPage.css'
import { Link, useNavigate } from 'react-router-dom';
import api, { ApiResponse, getRole, Role, saveIdentity, saveRefreshToken, saveToken } from '../../api/api';
import { Alert, Button } from 'react-bootstrap';
import { RoledMainMenu } from '../RoledMainMenu/RoledMainMenu';

interface AdministratorLoginPageState{
    username: string;
    password: string;
    errorMessage: string;
}

export const AdministratorLoginPage = () =>{
    const role: Role = getRole();
    const [userState, setStateUser] = useState<AdministratorLoginPageState>(
        {
            username: '',
            password: '',
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
        api('auth/administrator/login', 'post', {
            username: userState.username,
            password: userState.password,
        }, true)
        .then((res?: ApiResponse) =>{
            if(!res){
                console.log('No response receive!')
                return;
            }

            if(res.status === 'error'){
                setErrorMessage('System error... Try again!')
                return;
            }

            if(res.status === 'ok'){
                if(res.data.statusCode !== undefined){
                    let message = '';
                    
                    switch(res.data.statusCode){
                        case -3001: message = 'Unknown username!';
                        break;
                        case -3002: message = 'Bad passwrod!';
                        break;
                    }

                    setErrorMessage(message);
                    
                    return;
                }

                saveToken('administrator',res.data.token);
                saveRefreshToken('administrator',res.data.refreshToken)
                setIsLoggedIn(true);
                navigate('/administrator/dashboard')
            }
        })
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
                        </div>
                        <div className="text_field">
                            <label htmlFor="password">Lozinka</label><br />
                            <input placeholder='unesite lozinku...' type="password" id="password" required
                                                                value={userState?.password}
                                                                onChange={event => formInputChanged(event as any)}  />
                        </div>
                        
                        <Button className="submit" variant="primary"
                                onClick={ ()=> doLogin() }>
                            Prijavi se
                        </Button>
                    </form>
                </div>
                <Alert variant="danger"
                       className={userState.errorMessage ? '' : 'd-none'}>
                       { userState.errorMessage }
                </Alert>
            </div>

        </div>
        </>
    )
}
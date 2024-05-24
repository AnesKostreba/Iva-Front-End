import { useState } from 'react';
import './UserLoginPage.css'
import { Link, useNavigate } from 'react-router-dom';
import api, { ApiResponse, saveRefreshToken, saveToken } from '../../api/api';
import { Alert, Button } from 'react-bootstrap';

interface UserLoginPageState{
    email: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export const UserLoginPage = () =>{

    const [userState, setStateUser] = useState<UserLoginPageState>(
        {
            email: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    )

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

    const setLogginState = (isLoggedIn: boolean) =>{
        setStateUser(prevState =>({
            ...prevState,
            isLoggedIn: isLoggedIn
        }))
    }

    const doLogin = () =>{
        api('auth/user/login', 'post', {
            email: userState.email,
            password: userState.password,
        })
        .then((res?: ApiResponse) =>{
            console.log(res);
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
                        case -3001: message = 'Unknown email!';
                        break;
                        case -3002: message = 'Bad passwrod!';
                        break;
                    }

                    setErrorMessage(message);
                    
                    return;
                }

                saveToken(res.data.token);
                saveRefreshToken(res.data.refreshToken)

                setLogginState(true);
                navigate('/')
            }
        })
    }


    return(

        <div className="loginPage container-fluid d-flex flex-direction-row mt-4 justify-content-center">
            <div className=" bg-danger first">
                <div className="overly"></div>
                <div className="content ">
                    <h3 className="contentText">Dobro došli!</h3>
                    <h5 className="">Uloguj se i kupujte lakše!</h5>
                </div>
            </div>
            
            <div className="secound">
                <div className="center">
                    <form method="post" action="">
                        <h1>Prijavi se</h1>
                        <div className="text_field">
                            <label htmlFor="email">Email</label><br />
                            <input placeholder='unesite email...' type="email" id="email" required
                                                                value={userState.email}
                                                                onChange={event => formInputChanged(event as any)} />
                        </div>
                        <div className="text_field">
                            <label htmlFor="password">Lozinka</label><br />
                            <input placeholder='unesite lozinku...' type="password" id="password" required
                                                                value={userState?.password}
                                                                onChange={event => formInputChanged(event as any)}  />
                        </div>
                        <div className="pass">Zaboravili ste lozinku?</div>
                        
                        <Button className="submit" variant="primary"
                                onClick={ ()=> doLogin() }>
                            Prijavi se
                        </Button>
                        <div className="signup_link">Niste registrovani? <Link to={'/user/register'}>Registruj se</Link></div>
                    </form>
                </div>
                <Alert variant="danger"
                       className={userState.errorMessage ? '' : 'd-none'}>
                       { userState.errorMessage }
                </Alert>
            </div>

        </div>
    )
}
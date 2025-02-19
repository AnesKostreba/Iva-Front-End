import { useEffect, useState } from "react";
import api, { ApiResponse, getRole, Role, saveRefreshToken, saveToken } from "../../api/api";
import { Button, Spinner } from "react-bootstrap";
import './UserProfile.css';
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { OrdersPage } from "../OrdersPage/OrdersPage";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";

interface UserProfile{
    isAdministratorLoggedIn: boolean;
    userId: number;
    email: string;
    surname: string;
    forname: string;
    phoneNumber: string;
    postalAddress: string;
}

export const UserProfil = () =>{

    const role: Role = getRole();
    
    const[user, setUser] = useState<UserProfile>({
        isAdministratorLoggedIn: true,
        userId: 0,
        email: '',
        surname: '',
        forname: '',
        phoneNumber: '',
        postalAddress: '',
    });
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string>('');
    const navigate = useNavigate();


    const setLogginState = (isUserLoggedIn: boolean) =>{
        setUser(prevState =>({
            ...prevState,
            isUserLoggedIn: isUserLoggedIn
        }))
    }

    useEffect(()=>{
        const userId = localStorage.getItem('user_id');
        if(role === 'user'){
        api('api/user/profile/'+userId, 'get', {} , undefined, role)
            .then((res:ApiResponse)=>{
                try{
                    if(res?.status === 'login'){
                        setLogginState(false);
                        return;
                    }
                    if(res.status === 'error'){
                        console.log('Error')
                        return;
                    }
                    setUser(res.data)
                    setLoading(false)
                }catch{
                    setError('Failed to load user data!')
                    setLoading(false)
                }
            })
        }
    },[])

    const logOut = () =>{
        saveToken('user','');
        saveRefreshToken('user','');
        localStorage.removeItem('user_id');
        navigate('/user/login')
    }


    // if(loading){
    //     return <Spinner animation="border" variant="success" className="spiner"/>
    // }

    // const ProfileDetails = ({ user }: { user: UserProfile }) => (
    //     <div className="profileMenu">
    //         <p>Email: {user.email}</p>
    //         <p>Ime: {user.forname}</p>
    //         <p>Prezime: {user.surname}</p>
    //         <p>Adresa: {user.postalAddress}</p>
    //         <p>Broj telefona: {user.phoneNumber}</p>
    //     </div>
    // );
    
    return(
        <>
        <RoledMainMenu role="user"/>
        <div className="userProfile">
            {user ? (
                <div className="w-50">
                    <div className="profileMenu">
                        <p>Email: {user.email}</p>
                        <p>Ime: {user.forname}</p>
                        <p>Prezime: {user.surname}</p>
                        <p>Adresa: {user.postalAddress}</p>
                        <p>Broj telefona: {user.phoneNumber}</p>
                    </div>
                    <button className="odjaviMe" onClick={logOut}>
                        <FontAwesomeIcon icon={faRightFromBracket} /> Odjavi me
                    </button>
                </div>
            ) : (
                <p>No user data available!</p>
            )}
            <div className="mojePorudzbine w-50 d-flex justify-content-center">
                <nav className="profileNav">
                    
                        <Link className="linkMojePorudzbine" to="/user/orders">
                            <FontAwesomeIcon className="btnMojePorudzbine" icon={faBoxArchive}/>Moje porudžbine
                        </Link>
                    
                </nav>
            </div>
        </div>
        </>
    )

}
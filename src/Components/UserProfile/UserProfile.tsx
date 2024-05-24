import { useEffect, useState } from "react";
import api, { ApiResponse, saveRefreshToken, saveToken } from "../../api/api";
import { Spinner } from "react-bootstrap";
import './UserProfile.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface UserProfile{
    userId: number;
    email: string;
    surname: string;
    forname: string;
    phoneNumber: string;
    postalAddress: string;
}

export const UserProfil = () =>{

    const[user, setUser] = useState<UserProfile | null >(null);
    const[loading, setLoading] = useState<boolean>(true);
    const[error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(()=>{
        const userId = localStorage.getItem('user_id');

        if(userId){
            api(`api/user/profile/${userId}`, 'get', {})
                .then((res:ApiResponse)=>{

                    if(res.status === 'ok'){
                        setUser(res.data)
                        
                    }else{
                        setError('Failed to load user data')
                    }
                    setLoading(false);
                })
                .catch(()=>{
                    setError('Failed to load user data');
                    setLoading(false);
                });
                console.log(user)
        }else{
            setError('User not logged in');
            setLoading(false);
        }
        
    },[])


    if(loading){
        return <Spinner className="spiner" animation='border'/>;
    }

    const navigateToProfile = () =>{
        navigate('/user/profile');
    }

    const logout = () =>{
        saveToken('')
        saveRefreshToken('')
        navigate('/user/login')
    }

    return(
        <div className="userProfile">
            {user ? (
                <div>
                    <button onClick={navigateToProfile} className="buttonProfil">Profil</button>
                    <p>Email: {user.email}</p>
                    <p>Ime: {user.forname}</p>
                    <p>Prezime: {user.surname}</p>
                    <p>Vaša adresa: {user.postalAddress}</p>
                    <p>Broj telefona: {user.phoneNumber}</p>
                    <button onClick={logout} className="odjaviMe"><FontAwesomeIcon className="icon" icon={faRightFromBracket}/>Odjavi me</button>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </div>
    )

}
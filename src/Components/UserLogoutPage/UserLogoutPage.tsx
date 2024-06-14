import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { removeTokenData } from "../../api/api";

interface UserLogoutPage{
    isCompleted: boolean
}

export const UserLogoutPage = () =>{
    const navigate = useNavigate();
    const[adminLog, setAdminLog] = useState<UserLogoutPage>({
        isCompleted: false,
    })
    
    const finished = ()=>{
        setAdminLog({
            isCompleted: true
        })
    }
    const doLogout = () =>{
        removeTokenData('user')
        finished()
    }

    useEffect(()=>{
        doLogout()
    },[])


    if(adminLog.isCompleted === true){
        navigate('/user/login/')
    }

    return(
        <p>Logging oput...</p>
    )
}
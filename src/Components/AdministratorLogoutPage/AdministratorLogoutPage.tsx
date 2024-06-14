import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { removeTokenData } from "../../api/api";

interface AdministratorLogoutPageState{
    isCompleted: boolean
}

export const AdministratorLogoutPage = () =>{
    const navigate = useNavigate();
    const[adminLog, setAdminLog] = useState<AdministratorLogoutPageState>({
        isCompleted: false,
    })
    
    const finished = ()=>{
        setAdminLog({
            isCompleted: true
        })
    }
    const doLogout = () =>{
        removeTokenData('administrator')
        finished()
    }

    useEffect(()=>{
        if(adminLog.isCompleted === true){
            navigate('/administrator/login/')
        }
        doLogout()
    },[adminLog.isCompleted,navigate])


    // if(adminLog.isCompleted === true){
    //     navigate('/administrator/login/')
    // }

    return(
        <p>Logging oput...</p>
    )
}
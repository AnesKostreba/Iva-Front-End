import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api, { ApiResponse, getIdentity } from "../../api/api";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";

interface AdministratorDashboard {
    isAdministratorLoggedIn: boolean;
}



const AdministratorDashboard = () =>{
    const navigate = useNavigate();
    const[adminPage, setAdminState] = useState<AdministratorDashboard>({
        isAdministratorLoggedIn: true
    })

    const setLogginState = (isLoggedIn: boolean) =>{
        setAdminState(prevState =>({
            ...prevState,
            isAdministratorLoggedIn: isLoggedIn
        }))
    }

    useEffect(()=>{
        getMyData()
    })

    const getMyData = () =>{
        api('/api/administrator/', 'get', {}, 'administrator')
            .then((res:ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }


            })
    }

    if(adminPage.isAdministratorLoggedIn === false){
        navigate('/administrator/login')
    }

    return (
        <>
        <RoledMainMenu role="administrator"/>
        <Container>
            
            <Card>
                <CardBody>
                    <CardTitle>
                        <FontAwesomeIcon icon={faHome}/>Administrator Dashboard
                    </CardTitle>

                    <ul>
                        <li>
                            <Link to='/administrator/dashboard/category/'>Kategorije</Link>
                        </li>
                        <li>
                            <Link to='/administrator/dashboard/category/'>Osobine</Link>
                        </li>
                        <li>
                            <Link to='/administrator/dashboard/article/'>Artikli</Link>
                        </li>
                    </ul>
                </CardBody>
            </Card>
        </Container>
        </>
    )
}

export default AdministratorDashboard;
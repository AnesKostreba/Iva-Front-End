import { faHome, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Nav, NavItem } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { ApiResponse, getIdentity, getRole, Role } from "../../api/api";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";

interface AdministratorDashboard {
    isAdministratorLoggedIn: boolean;
}



const AdministratorDashboard = () =>{
    const location = useLocation();
    const role: Role = getRole();
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
        if(role !== 'administrator'){
            setLogginState(false)
            navigate('/administrator/login')
        }else{
        getMyData()
        }
    },[role,navigate])

    const getMyData = () =>{
        api('/api/administrator/', 'get', {}, undefined,role)
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
        <Container className="mt-3">
            
            <Card>
                <CardBody>
                    <CardTitle>
                        <FontAwesomeIcon icon={faHome}/>Administrator Dashboard
                    </CardTitle>

                    <Nav>
                        <NavItem>
                            <Link to='/administrator/dashboard/category/' className='btn btn-success m-3'>
                                <FontAwesomeIcon icon={faLink}/> Kategorije
                            </Link>
                            <Link to='/administrator/dashboard/article/' className='btn btn-success m-3'>
                                <FontAwesomeIcon icon={faLink}/> Artikli
                            </Link>
                            <Link to='/administrator/dashboard/order/' className='btn btn-success m-3'>
                                <FontAwesomeIcon icon={faLink}/> Porudžbine
                            </Link>
                        </NavItem>
                    </Nav>

                    {/* <ul>
                        <li>
                            <Link to='/administrator/dashboard/category/'>Kategorije</Link>
                        </li>
                        <li>
                            <Link to='/administrator/dashboard/category/'>Osobine</Link>
                        </li>
                        <li>
                            <Link to='/administrator/dashboard/article/'>Artikli</Link>
                        </li>
                    </ul> */}
                </CardBody>
            </Card>
        </Container>
        </>
    )
}

export default AdministratorDashboard;
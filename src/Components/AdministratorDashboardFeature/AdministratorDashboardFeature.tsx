import { faBackward, faEdit, faListUl, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, CardTitle, Container, FormControl, FormGroup, FormLabel, Modal, ModalBody, ModalHeader, ModalTitle, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { ApiResponse, getRole, Role } from "../../api/api";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";
import FeatureType from "../../types/FeatureType";
import ApiFeatureDto from "../../dtos/ApiFeatureDto";
import './AdministratorDashboardFeature.css'

interface AdministratorDashboardFeature {
    isAdministratorLoggedIn: boolean;
    features: FeatureType[];
    addModal: {
        visible: boolean;
        name: string;
        message: string;
    }
    editModal: {
        featureId?: number;
        visible: boolean;
        name: string;
        message: string;
    }
}



const AdministratorDashboardFeature = () =>{
    const role: Role = getRole();
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const[adminPage, setAdminState] = useState<AdministratorDashboardFeature>({
        isAdministratorLoggedIn: true,
        features: [],
        addModal:{
            visible: false,
            name: '',
            message: '',
        },

        editModal:{
            visible: false,
            name: '',
            message: '',
        }
    })

    const setAddModalVisibleState = (newState: boolean) =>{
        setAdminState(prevState => ({
            ...prevState,
            addModal:{
                ...prevState.addModal,
                visible: newState
            }
        }))
    }

    const setAddModalStringFieldState = (fieldName: string, newValue: string) => {
        setAdminState(prevState => ({
            ...prevState,
            addModal: {
                ...prevState.addModal,
                [fieldName]: newValue
            }
        }));
    };

    //

    const setEditModalVisibleState = (newState: boolean) =>{
        setAdminState(prevState => ({
            ...prevState,
            editModal:{
                ...prevState.editModal,
                visible: newState
            }
        }))
    }

    const setEditModalStringFieldState = (fieldName: string, newValue: string) => {
        setAdminState(prevState => ({
            ...prevState,
            editModal: {
                ...prevState.editModal,
                [fieldName]: newValue
            }
        }));
    };

    const setEditModalNumberFieldState = (fieldName: string, newValue: any) => {
        setAdminState(prevState => ({
            ...prevState,
            editModal: {
                ...prevState.editModal,
                [fieldName]: newValue === 'null' ? null : Number(newValue)
            }
        }));
    };

    //

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
            return;
        }
        getFeatures()
    },[id])

    const getFeatures = () =>{
        api('/api/feature/?filter=categoryId||$eq||'+ id, 'get', {}, undefined, role)
            .then((res:ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }

                putFeaturesInState(res.data)
            })
    }

    const putFeaturesInState = (response: any) => {
        if (!Array.isArray(response.data)) {
            console.error("Podatci nisu niz", response.data);
            return;
        }
        const features: FeatureType[] = response.data.map((feature: ApiFeatureDto) => {
            return {
                featureId: feature.featureId,
                categoryId: feature.categoryId,
                name: feature.name,
            };
        });
    
        setAdminState(prevState => ({
            ...prevState,
            features: features
        }));
    }

    

    const showAddModal = () => {
        setAddModalStringFieldState('name', '');
        setAddModalStringFieldState('message', '');
        setAddModalVisibleState(true);
    };

    const showEditModal = (feature:FeatureType) =>{
        setEditModalStringFieldState('name', String(feature.name));
        setEditModalNumberFieldState('featureId', feature.featureId.toString())
        setEditModalStringFieldState('message', '');
        setEditModalVisibleState(true);
    }

    const doEditFeature = () =>{
        api('api/feature/'+ adminPage.editModal.featureId, 'patch', {
            name: adminPage.editModal.name,
            categoryId: id
        }, undefined,role)
        .then((res: ApiResponse)=>{
            console.log('API response', res)
            if(res?.status === 'login'){
                setLogginState(false);
                return;
            }
            if(res.status === 'error'){
                console.log("Error" , res.status)
                setAddModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }

            setEditModalVisibleState(false);
            getFeatures()
        })
        .catch((error)=>{
            console.log('Unexpected error', error)
            setAddModalStringFieldState('message', 'Kategorija vec postoji!')
        })
    }

    const doAddFeature = () =>{
        api('api/feature/', 'post', {
            name: adminPage.addModal.name,
            categoryId: id
        },undefined, role)
        .then((res: ApiResponse)=>{
            console.log('API response', res)
            if(res?.status === 'login'){
                setLogginState(false);
                return;
            }
            if(res.status === 'error'){
                setAddModalStringFieldState('message', 'Kategorija vec postoji!');
                return;
            }
            // treba obraditi gresku o duplikatima!

            setAddModalVisibleState(false);
            getFeatures()
        })
        .catch((error)=>{
            console.log('Unexpected error', error)
            setAddModalStringFieldState('message', 'Kategorija vec postoji!')
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
                        <FontAwesomeIcon icon={faListUl}/>Osobine
                    </CardTitle>

                    <Table hover size="sm" bordered>
                        <thead>
                            <tr>
                                <th colSpan={2}>
                                    <Link to={'/administrator/dashboard/category'} 
                                        className="btn btn-sm btn-secoundary">
                                            <FontAwesomeIcon icon={faBackward}/>Nazad u kategorije
                                        </Link>
                                </th>
                                <th className="text-center">
                                    <Button
                                        onClick={() => showAddModal()}
                                        variant="primary" size="sm">
                                            <FontAwesomeIcon icon={faPlus}/>Dodaj
                                    </Button>
                                </th>
                            </tr>
                            <tr>
                                <th className="text-right">ID</th>
                                <th>Naziv</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminPage.features.map(feature =>(
                                <tr key={feature.featureId}>
                                    <td className="text-right">{feature.featureId}</td>
                                    <td>{feature.name}</td>
                                    <td className="text-center">
                                        <Button 
                                            onClick={() => showEditModal(feature)}
                                            variant="success" size="sm">
                                            <FontAwesomeIcon icon={faEdit}/>Uredi
                                        </Button>
                                    </td>
                                </tr>
                            ),this)}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            <Modal size="lg" centered show={adminPage.addModal.visible} onHide={()=>              setAddModalVisibleState(false)}>

                <ModalHeader closeButton className="vasaKorpa">
                    <ModalTitle className="">Dodaj novu osobinu</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <FormLabel htmlFor="name">Naziv</FormLabel>
                        <FormControl id="name" type="text" value={adminPage.addModal.name}
                                     onChange={(e) => 
                                     setAddModalStringFieldState('name', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <Button variant="primary" onClick={ () => doAddFeature() }>
                            <FontAwesomeIcon icon={faPlus}/>Dodaj novu osobinu
                        </Button>
                    </FormGroup>
                    { adminPage.addModal.message ? (
                        <Alert variant="danger">
                            {adminPage.addModal.message}
                        </Alert>
                    ) : '' }
                </ModalBody>
            </Modal>

            

            <Modal size="lg" centered show={adminPage.editModal.visible} onHide={()=>              setEditModalVisibleState(false)}>

                <ModalHeader closeButton className="vasaKorpa">
                    <ModalTitle className="">Izmenite osobine</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <FormLabel htmlFor="name">Naziv</FormLabel>
                        <FormControl id="name" type="text" value={adminPage.editModal.name}
                                     onChange={(e) => 
                                     setEditModalStringFieldState('name', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    
                    <FormGroup>
                        <Button variant="primary" onClick={ () => doEditFeature() }>
                            <FontAwesomeIcon icon={faEdit}/>Izmeni osobinu
                        </Button>
                    </FormGroup>
                    { adminPage.editModal.message ? (
                        <Alert variant="danger">
                            {adminPage.editModal.message}
                        </Alert>
                    ) : '' }
                </ModalBody>
            </Modal>
        </Container>
        </>
    )
}

export default AdministratorDashboardFeature;
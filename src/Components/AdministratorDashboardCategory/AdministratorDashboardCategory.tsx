import { faEdit, faListAlt, faListUl, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, CardTitle, Container, FormControl, FormGroup, FormLabel, Modal, ModalBody, ModalHeader, ModalTitle, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api, { ApiResponse, getRole, Role } from "../../api/api";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";
import { CategoryType } from "../../types/CategoryType";
import ApiCategoryDto from "../../dtos/ApiCategoryDto";
import './AdministratorDashboardCategory.css';

interface AdministratorDashboardCategory {
    isAdministratorLoggedIn: boolean;
    categories: CategoryType[];
    addModal: {
        visible: boolean;
        name: string;
        imagePath: string;
        parentCategoryId: number | null;
        message: string;
    }
    editModal: {
        categoryId?: number;
        visible: boolean;
        name: string;
        imagePath: string;
        parentCategoryId: number | null;
        message: string;
    }
}



const AdministratorDashboardCategory = () =>{
    const role: Role = getRole();
    const navigate = useNavigate();
    const[adminPage, setAdminState] = useState<AdministratorDashboardCategory>({
        isAdministratorLoggedIn: true,
        categories: [],
        addModal:{
            visible: false,
            name: '',
            imagePath: '',
            parentCategoryId: null,
            message: '',
        },

        editModal:{
            visible: false,
            name: '',
            imagePath: '',
            parentCategoryId: null,
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

    const setAddModalNumberFieldState = (fieldName: string, newValue: any) => {
        setAdminState(prevState => ({
            ...prevState,
            addModal: {
                ...prevState.addModal,
                [fieldName]: newValue === 'null' ? null : Number(newValue)
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
            setLogginState(false);
            navigate('/administrator/login')
            return;
        }
        getCategories()
    },[])

    const putCategoriesInState = (data: ApiCategoryDto[]) =>{
        const categories: CategoryType[] = data.map(category =>{
            return{
                categoryId: category.categoryId,
                name:       category.name,
                parentCategoryId: category.parentCategoryId,
                imagePath: category.imagePath,
                // items:      [] // artikli
            };
        });

        setAdminState(prevState => ({
            ...prevState,
            categories: categories
        }))
    }

    const getCategories = () =>{
        
        api('/api/category/', 'get', {}, undefined, role)
            .then((res:ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }

                putCategoriesInState(res.data)
            })
    }

    const showAddModal = () => {
        setAddModalStringFieldState('name', '');
        setAddModalStringFieldState('imagePath', '');
        setAddModalStringFieldState('message', '');
        setAddModalNumberFieldState('parentCategoryId', 'null');
        setAddModalVisibleState(true);
    };

    const showEditModal = (category:CategoryType) =>{
        setEditModalStringFieldState('name', String(category.name));
        setEditModalStringFieldState('imagePath', String(category.imagePath));
        setEditModalStringFieldState('message', '');
        setEditModalNumberFieldState('parentCategoryId', category.parentCategoryId);
        setEditModalNumberFieldState('categoryId', category.categoryId);
        setEditModalVisibleState(true);
    }

    const doEditCategory = () =>{
        api('api/category/'+ adminPage.editModal.categoryId, 'patch', {
            name: adminPage.editModal.name,
            imagePath: adminPage.editModal.imagePath,
            parentCategoryId: adminPage.editModal.parentCategoryId
        }, undefined, role)
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
            getCategories()
        })
        .catch((error)=>{
            console.log('Unexpected error', error)
            setAddModalStringFieldState('message', 'Kategorija vec postoji!')
        })
    }

    const doAddCategory = () =>{
        api('api/category/create', 'post', {
            name: adminPage.addModal.name,
            imagePath: adminPage.addModal.imagePath,
            parentCategoryId: adminPage.addModal.parentCategoryId
        }, undefined, role)
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
            getCategories()
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
            
            <Card className="mt-2">
                <CardBody>
                    <CardTitle >
                        <FontAwesomeIcon className="kategorijeIcon" icon={faListAlt}/>Kategorije
                    </CardTitle>

                    <Table hover size="sm" bordered>
                        <thead>
                            <tr>
                                <th colSpan={3}></th>
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
                                <th className="text-right">Pripada kategoriji ID</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminPage.categories.map(category =>(
                                <tr key={category.categoryId}>
                                    <td className="text-right">{category.categoryId}</td>
                                    <td>{category.name}</td>
                                    <td className="text-right">{category.parentCategoryId}</td>
                                    <td className="text-center">
                                        <Link to={'/administrator/dashboard/feature/'+category.categoryId} className="btn btn-sm btn-success osobine">
                                            <FontAwesomeIcon className="" icon={faListUl}/>Osobine
                                        </Link>
                                        <Button 
                                            onClick={() => showEditModal(category)}
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
                    <ModalTitle className="">Dodaj novu kategoriju</ModalTitle>
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
                        <FormLabel htmlFor="imagePath">Putanja slike</FormLabel>
                        <FormControl id="imagePath" type="url" value={adminPage.addModal.imagePath}
                                     onChange={(e) => 
                                     setAddModalStringFieldState('imagePath', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="parentCategoryId">Pripada kategoriji</FormLabel>
                        <FormControl id="parentCategoryId" as='select' value={adminPage.addModal.parentCategoryId?.toString() || 'null'}
                                     onChange={(e) => 
                                     setAddModalNumberFieldState('parentCategoryId', e.target.value)}>
                                     <option value='null'>Ne pripada ni jednoj kategoriji</option>
                                     { adminPage.categories.map(category =>(
                                        <option key={category.categoryId} value={category.categoryId?.toString()}>
                                            { category.name }
                                        </option>
                                     )) }
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Button variant="primary" onClick={ () => doAddCategory() }>
                            <FontAwesomeIcon icon={faPlus}/>Dodaj novu kategoriju
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
                    <ModalTitle className="">Izmenite kategoriju</ModalTitle>
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
                        <FormLabel htmlFor="imagePath">Putanja slike</FormLabel>
                        <FormControl id="imagePath" type="url" value={adminPage.editModal.imagePath}
                                     onChange={(e) => 
                                     setEditModalStringFieldState('imagePath', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="parentCategoryId">Pripada kategoriji</FormLabel>
                        <FormControl id="parentCategoryId" as='select' value={adminPage.editModal.parentCategoryId?.toString() || 'null'}
                                     onChange={(e) => 
                                     setEditModalNumberFieldState('parentCategoryId', e.target.value)}>
                                     <option value='null'>Ne pripada ni jednoj kategoriji</option>
                                     { adminPage.categories
                                     .filter(category => category.categoryId !== adminPage.editModal.categoryId)
                                     .map(category =>(
                                        <option key={category.categoryId} value={category.categoryId?.toString()}>
                                            { category.name }
                                        </option>
                                     )) }
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Button variant="primary" onClick={ () => doEditCategory() }>
                            <FontAwesomeIcon icon={faEdit}/>Izmeni
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

export default AdministratorDashboardCategory;
import { faBackward, faImages, faPlus, faRemove} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardTitle, Col, Container, FormControl, FormGroup, FormLabel, Nav, NavItem, Row} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { ApiResponse, Role, apiFile, getRole } from "../../api/api";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";
import './AdministratorDashboardPhoto.css'
import PhotoType from "../../types/PhotoType";
import { ApiConfig } from "../../config/api.config";

interface AdministratorDashboardPhotoState {
    isAdministratorLoggedIn: boolean;
    photos: PhotoType[];
}



const AdministratorDashboardPhoto = () =>{
    const role: Role = getRole();
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const[photoState, setPhotoState] = useState<AdministratorDashboardPhotoState>({
        isAdministratorLoggedIn: true,
        photos: [],
    })

   

    useEffect(()=>{
        getPhotos()
    },[id])

    const getPhotos = () =>{
        api('/api/article/'+ id +'/?join=photos', 'get', {}, undefined, role)
            .then((res:ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }

                setPhotoState(prevState => ({
                    ...prevState,
                    photos: res.data.photos
                }));
            })

    }
    const setLogginState = (isLoggedIn: boolean) =>{
        setPhotoState(prevState =>({
            ...prevState,
            isAdministratorLoggedIn: isLoggedIn
        }))
    }

    if(photoState.isAdministratorLoggedIn === false){
        navigate('/administrator/login')
    }

    const uploadArticlePhoto = async (articleId:number, file: File) =>{
        return await apiFile('/api/article/'+articleId+'/uploadPhoto', 'photo', file, ['administrator']);
    }

    const doUpload = async () =>{
        const filePicker:any = document.getElementById('add-photo');
        if(filePicker?.files.length === 0){
            return;
        }

        const file = filePicker.files[0];
        await uploadArticlePhoto(Number(id), file);
        filePicker.value = '';
        getPhotos();
    }

    const deletePhoto = (photoId: number) =>{
        if(!window.confirm('Jeste li sigurni da želite obrisati fotografiju?')){
            return;
        }
        api('/api/article/'+id+'/deletePhoto/'+photoId+'/', 'delete', {} , undefined, role)
            .then((res:ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }

                getPhotos();
            })
    }

    const printSinglePhoto = (photo: PhotoType) =>{
        return(
            <Col key={photo.photoId} xs='12' sm='6' md='4' lg='3'>
                <Card>
                    <CardBody>
                        <img alt={"Photo "+photo.photoId}
                             src={ApiConfig.PHOTO_PATH + 'medium/' + photo.imagePath} 
                             className="w-100"/>
                    </CardBody>
                    <CardFooter>
                        {photoState.photos.length > 1 ? (
                            <Button variant="danger" className="w-100"
                                    onClick={() => deletePhoto(photo.photoId)}>
                                <FontAwesomeIcon icon={faRemove}/> Obriši sliku
                            </Button>
                        ) : ''}
                    </CardFooter>
                </Card>
            </Col>
        )
    }
   
    

    return (
        <>
        <RoledMainMenu role="administrator"/>

        <Container className="mt-2">
            
            <Card>
                <CardBody>
                    <CardTitle>
                        <FontAwesomeIcon icon={faImages}/> Fotografije
                    </CardTitle>
                    <Nav>
                        <NavItem>
                            <Link to='/administrator/dashboard/article' className='btn btn-sm btn-success m-3'>
                                <FontAwesomeIcon icon={faBackward}/> Vrati se u artikle
                            </Link>
                        </NavItem>
                    </Nav>
                    <Row>
                        {photoState.photos?.map(printSinglePhoto, this)}
                    </Row>
                    
                    <FormGroup className="mt-5">
                        <p className="p-0 m-0">
                            <strong>Dodaj novu fotografiju za ovaj artikal</strong>
                        </p>
                        <FormLabel htmlFor="add-photo"></FormLabel>
                        <FormControl className="mb-2" id="add-photo" type="file"/>
                    </FormGroup>
                    <FormGroup>
                        <Button variant="success"
                                onClick={() => doUpload()}>
                            <FontAwesomeIcon icon={faPlus}/> Dodaj fotografiju
                        </Button>
                    </FormGroup>
                </CardBody>
            </Card>
        </Container>
        </>
    )
}

export default AdministratorDashboardPhoto;
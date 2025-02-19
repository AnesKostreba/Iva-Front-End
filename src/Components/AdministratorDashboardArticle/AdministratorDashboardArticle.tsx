import { faEdit, faImage, faListAlt, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, CardTitle, Col, Container, FormControl, FormGroup, FormLabel, Modal, ModalBody, ModalHeader, ModalTitle, Row, Table } from "react-bootstrap";
import { Form, Link, useNavigate } from "react-router-dom";
import api, { ApiResponse, getRole, Role } from "../../api/api";
import { apiFile } from "../../api/api";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";
import { ArticleType } from "../../types/ArticleType";
import ApiArticleDto from "../../dtos/ApiArticleDto";
import './AdministratorDashboardArticle.css';
import { CategoryType } from "../../types/CategoryType";
import ApiCategoryDto from "../../dtos/ApiCategoryDto";
import { parse } from "path";

interface AdministratorDashboardArticle {
    isAdministratorLoggedIn: boolean;
    articles: ArticleType[];
    categories: CategoryType[];
    status: string[];
    filters: {
        keywords: string;
    };
    addModal: {
        visible: boolean;
        name: string;

        message: string;
        categoryId: number;
        excerpt: string;
        description: string;
        // status: string;
        // isPromoted: number;
        price: number;
        features: {
            use: number,
            featureId: number;
            name: string;
            value: string;
        }[]
    }
    editModal: {
        visible: boolean;
        message: string;
        
        articleId?: number;
        name: string;
        categoryId: number;
        excerpt: string;
        description: string;
        status: string;
        isPromoted: number;
        price: number;
        features: {
            use: number,
            featureId: number;
            name: string;
            value: string;
        }[]
        
    }
}

interface FeatureBaseType{
    name: string;
    featureId: number;
}



const AdministratorDashboardArticle = () =>{
    const role: Role = getRole();
    const navigate = useNavigate();
    const[adminPage, setAdminState] = useState<AdministratorDashboardArticle>({
        isAdministratorLoggedIn: true,
        articles: [],
        categories: [],
        filters: {
            keywords: ''
        },
        status: [
            "available",
            "visible",
            "hidden"
        ],

        addModal:{
            visible: false,
            message: '',

            name: '',
            categoryId: 1,
            excerpt: '',
            description: '',
            // status: 'available',
            // isPromoted: 0,
            price: 0.01,
            features: [],
        },

        editModal:{
            visible: false,
            
            message: '',
            name: '',
            categoryId: 1,
            excerpt: '',
            description: '',
            status: 'available',
            isPromoted: 0,
            price: 0.01,
            features: [],
        }
    })

    const filterKeywordsChanged = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setAdminState({
            ...adminPage,
            filters:{
                ...adminPage.filters,
                keywords: event.target.value
            }
        })
    }

    useEffect(()=>{
        if(role !== 'administrator'){
            setLogginState(false)
            navigate('administrator/login')
        }
        getArticlesWithFilter()
    },[])

    const getArticlesWithFilter = () =>{
        if(!adminPage.filters.keywords){
            return getArticles();
        }
        api('/api/article/search-by-name/','post',{
            keywords: adminPage.filters.keywords
        },undefined, role)
            .then((res: ApiResponse)=>{
                if(res?.status === 'login'){
                    return setLogginState(false)
                }
                if(res?.status === 'error'){
                    return 'Request error.';
                }
                setAdminState({...adminPage, articles: res.data})
            })
    }

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

    const setAddModalFeatureUse = (featureId: number, use: boolean) =>{
        const addFeatures:{featureId: number; use: number} [] = [...adminPage.addModal.features];
        for(const feature of addFeatures){
            if(feature.featureId === featureId){
                feature.use = use ? 1 : 0;
                break;
            }
        }

        setAdminState(prevState => ({
            ...prevState,
            features: addFeatures
        }))
    }

    const setAddModalFeatureValue = (featureId: number, value: string) =>{
        const addFeatures:{featureId: number; value: string} [] = [...adminPage.addModal.features];
        for(const feature of addFeatures){
            if(feature.featureId === featureId){
                feature.value = value;
                break;
            }
        }

        setAdminState(prevState => ({
            ...prevState,
            features: addFeatures
        }))
    }

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

    // const setEditModalFeatureUse = (featureId: number, use: boolean) =>{
    //     const editFeatures:{featureId: number; use: number} [] = [...adminPage.editModal.features];
    //     for(const feature of editFeatures){
    //         if(feature.featureId === featureId){
    //             feature.use = use ? 1 : 0;
    //             break;
    //         }
    //     }

    //     setAdminState(prevState => ({
    //         ...prevState,
    //         editModal: {
    //             ...prevState.editModal,
    //             features: editFeatures
    //         }
    //     }))
    // }

    // const setEditModalFeatureValue = (featureId: number, value: string) =>{
    //     const editFeatures:{featureId: number; value: string} [] = [...adminPage.editModal.features];
    //     for(const feature of editFeatures){
    //         if(feature.featureId === featureId){
    //             feature.value = value;
    //             break;
    //         }
    //     }

    //     setAdminState(prevState => ({
    //         ...prevState,
    //             features: editFeatures
    //     }));
    // }

    const setEditModalFeatureUse = (featureId: number, use: boolean) => {
        const editFeatures = adminPage.editModal.features.map(feature => 
            feature.featureId === featureId ? { ...feature, use: use ? 1 : 0 } : feature
        );
    
        setAdminState(prevState => ({
            ...prevState,
            editModal: {
                ...prevState.editModal,
                features: editFeatures
            }
        }));
    };

    const setEditModalFeatureValue = (featureId: number, value: string) => {
        const editFeatures = adminPage.editModal.features.map(feature => 
            feature.featureId === featureId ? { ...feature, value: value } : feature
        );
    
        setAdminState(prevState => ({
            ...prevState,
            editModal: {
                ...prevState.editModal,
                features: editFeatures
            }
        }));
    };

    const setEditModalNumberFieldState = (fieldName: string, newValue: any) => {
        setAdminState(prevState => ({
            ...prevState,
            editModal: {
                ...prevState.editModal,
                [fieldName] : Number(newValue)
                // [fieldName]: newValue === 'null' ? null : Number(newValue)
            }
        }));
    };

    const putCategoriesInState = (data: ApiCategoryDto[]) =>{
        if(data && data.length > 0){
            const categories: CategoryType[] = data?.map(category =>{
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

    //

    const setLogginState = (isLoggedIn: boolean) =>{
        setAdminState(prevState =>({
            ...prevState,
            isAdministratorLoggedIn: isLoggedIn
        }))
    }

    const getFeaturesByCategoryId = async (categoryId: number):Promise<FeatureBaseType[]> =>{
        return new Promise(resolve =>{
            api('/api/feature/?filter=categoryId||$eq||'+categoryId+'/', 'get', {}, undefined, role)
            .then((res:ApiResponse) =>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return resolve([]);
                }
                const responseData = res.data?.data;
                
                if(!Array.isArray(responseData)){
                    return resolve([]);
                }
                
                const features: FeatureBaseType[] = responseData?.map((item: any) =>({
                    featureId: item.featureId,
                    name: item.name,
                }))

                resolve(features)

            })
            .catch(error =>{
                console.error('Error fetching features:', error);
                resolve([])
            })
        })
        
    }

    useEffect(()=>{
        if(role !== 'administrator'){
            setLogginState(false);
            navigate('/administrator/login')
            return;
        }
        getCategories();
        getArticles();
    },[])

    useEffect(() => {
        if(role !== 'administrator'){
            setLogginState(false)
            navigate('/administrator/login')
        } // koji se pokrece svaki put kada se modal otvori
        if (adminPage.addModal.visible) {
            const loadFeaturesForSelectedCategory = async () => {
                const features = await getFeaturesByCategoryId(adminPage.addModal.categoryId);
                const stateFeatures = features.map(feature => ({
                    featureId: feature.featureId,
                    name: feature.name,
                    value: '',
                    use: 0,
                }));

                setAdminState(prevState => ({
                    ...prevState,
                    addModal: {
                        ...prevState.addModal,
                        features: stateFeatures,
                    }
                }));
            };

            loadFeaturesForSelectedCategory();
        }
    }, [adminPage.addModal.visible, adminPage.addModal.categoryId]);

    const putArticlesInState = (data: ApiArticleDto[]) =>{
        
        if(data && data.length > 0){
            const articles: ArticleType[] = data?.map(article =>{
                return{
                    articleId: article.articleId,
                    name: article.name,
                    excerpt: article.excerpt,
                    description: article.description,
                    imageUrl: article.photos && article.photos.length > 0 ? article.photos[0].imagePath : '',
                    price: article.articlePrices[article.articlePrices.length-1].price,
                    status: article.status,
                    isPromoted: article.isPromoted,
                    articleFeatures: article.articleFeatures,
                    features: article.features,
                    articlePrices: article.articlePrices,
                    photos: article.photos,
                    category: article.category,
                    categoryId: article.categoryId
                };
            });
            setAdminState(prevState => ({
                ...prevState,
                articles: articles
            }))
        }
    }

    const getArticles = () =>{
        api('/api/article/?join=articleFeatures&join=features&join=articlePrices&join=photos&join=category', 'get', {}, undefined, role)
            .then((res:ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }

                putArticlesInState(res.data)
            })
    }

    const showAddModal = () => {
        setAddModalStringFieldState('name', '');
        setAddModalStringFieldState('excerpt', '');
        setAddModalStringFieldState('description', '');
        setAddModalStringFieldState('imagePath', '');
        setAddModalStringFieldState('message', '');
        setAddModalNumberFieldState('categoryId', '1');
        setAddModalNumberFieldState('price', '0.01');

        
        setAdminState(prevState =>({
            ...prevState,
            addModal:{
                ...prevState.addModal,
                features: [],
            }
        }))

        setAddModalVisibleState(true);
    };

    const showEditModal = async (article:ArticleType) =>{
        setEditModalStringFieldState('message', '');
        setEditModalStringFieldState('name', String(article.name));
        setEditModalStringFieldState('excerpt', String(article.excerpt));
        setEditModalStringFieldState('description', String(article.description));
        setEditModalStringFieldState('status', String(article.status));
        setEditModalNumberFieldState('articleId', article.articleId);

        let price = 0;

        if(article.articlePrices && article.articlePrices.length > 0){
            price = article.articlePrices[article.articlePrices.length-1].price
        }


        setEditModalNumberFieldState('price', price);
        setEditModalNumberFieldState('isPromoted', article.isPromoted);
        console.log(article)
        if(!article.categoryId){
            return;
        }

        const categoryId: number = article.categoryId;

        const allFeatures: any[] = await getFeaturesByCategoryId(categoryId);

        for(const apiFeature of allFeatures){
            apiFeature.use = 0;
            apiFeature.value = '';

            if(!article.articleFeatures){
                continue;
            }
            for( const articleFeature of article.articleFeatures) {

                if(articleFeature.featureId === apiFeature.featureId){
                    apiFeature.use = 1;
                    apiFeature.value = articleFeature.value;
                }
            }
        }

        setAdminState(prevState => ({
            ...prevState,
            editModal: {
                ...prevState.editModal,
                features: allFeatures.map(feature => ({
                    featureId: feature.featureId,
                    name: feature.name,
                    value: feature.value,
                    use: feature.use
                }))
            }
        }));

        setEditModalVisibleState(true);
    }

    const doEditArticle = () =>{
        api('api/article/'+ adminPage.editModal.articleId, 'patch', {
            name: adminPage.editModal.name,
            excerpt: adminPage.editModal.excerpt,
            description: adminPage.editModal.description,
            status: adminPage.editModal.status,
            isPromoted: Number(adminPage.editModal.isPromoted),
            price: adminPage.editModal.price,
            features: adminPage.editModal.features
            .filter(feature => feature.use === 1) // filtrirati samo ako postoji feature
            .map(feature => ({
                featureId: feature.featureId,
                value: feature.value
            })),
        }, undefined, role)
        
        .then((res: ApiResponse)=>{
            if(res?.status === 'login'){
                setLogginState(false);
                return;
            }
            if(res.status === 'error'){
                setAddModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }
            setEditModalVisibleState(false);
            getArticles()
        })
        .catch((error)=>{
            setAddModalStringFieldState('message', 'Kategorija vec postoji!')
        })
    }

    const uploadArticlePhoto = async (articleId:number, file: File) =>{
        return await apiFile('/api/article/'+articleId+'/uploadPhoto', 'photo', file, ['administrator']);
    }

    const doAddArticle = () =>{
        const filePicker:any = document.getElementById('add-photo');
        if(filePicker?.files.length === 0){
            setAddModalStringFieldState('message', 'Morate popuniti sve podatke!');
            return;
        }
        api('api/article/', 'post', {
            categoryId : adminPage.addModal.categoryId,
            name: adminPage.addModal.name,
            excerpt: adminPage.addModal.excerpt,
            description: adminPage.addModal.description,
            // status: adminPage.addModal.status,
            // isPromoted: adminPage.addModal.isPromoted,
            price: adminPage.addModal.price,
            features: adminPage.addModal.features
            .filter(feature => feature.use === 1) // filtrirati samo ako postoji feature
            .map(feature => ({
                featureId: feature.featureId,
                value: feature.value
            })),
        },undefined, role)
        .then( async (res: ApiResponse)=>{
            
            if(res?.status === 'login'){
                setLogginState(false);
                return;
            }
            if(res.status === 'error'){
                setAddModalStringFieldState('message', JSON.stringify(res.status));
                return;
            }
            // treba obraditi gresku o duplikatima!

            const articleId: number = res.data.articleId;
            const file = filePicker.files[0];
            const res2 = await uploadArticlePhoto(articleId, file);
            console.log('Uploading article',res2)
            //ako file nije dodat a prodje dodavanje artikla treba obavestiti korisnika
            if(res2.status !== 'ok'){
                setAddModalStringFieldState('message', 'Nije moguce upload-ovati file. Pokusajte ponovo!');
                return;
            }
            setAddModalVisibleState(false);
            getArticles()
        })
        .catch((error)=>{
            setAddModalStringFieldState('message', JSON.stringify(error))
        })
    }

    const addModalCategoryChanged = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = event.target.value;
        setAddModalNumberFieldState('categoryId', selectedCategoryId);

        console.log('Selected category id: ',selectedCategoryId)

        const features = await getFeaturesByCategoryId(adminPage.addModal.categoryId)
        const stateFeatures = features.map(feature => ({
            featureId : feature.featureId,
            name: feature.name,
            value: '',
            use: 0,
        }))

        setAdminState(prevState =>({
            ...prevState,
            addModal:{
                ...prevState.addModal,
                features: stateFeatures
            }
        }))
        

    }

    const printAddModalFeatureInput = (feature: any) =>{
        return(
            <FormGroup key={feature.featureId}>
                <Row>
                    <Col xs='4' sm='1' className="text-center">
                        <input type="checkbox" value='1' checked={feature.use === 1}
                        onChange={(e) => setAddModalFeatureUse(feature.featureId, e.target.checked)}/>
                    </Col>
                    <Col xs='8' sm='3'>
                        { feature.name }
                    </Col>
                    <Col xs='12' sm='8'>
                    <FormControl type="text" value={feature.value}
                                 onChange={(e) => setAddModalFeatureValue(feature.featureId, e.target.value)}/>
                    </Col>
                </Row>
            </FormGroup>
        )
    }

    const printEditModalFeatureInput = (feature: any) =>{
        return(
            <FormGroup key={feature.featureId}>
                <Row>
                    <Col xs='4' sm='1' className="text-center">
                        <input type="checkbox" value='1' checked={feature.use === 1}
                        onChange={(e) => setEditModalFeatureUse(feature.featureId, e.target.checked)}/>
                    </Col>
                    <Col xs='8' sm='3'>
                        { feature.name }
                    </Col>
                    <Col xs='12' sm='8'>
                    <FormControl type="text" value={feature.value}
                                 onChange={(e) => setEditModalFeatureValue(feature.featureId, e.target.value)}/>
                    </Col>
                </Row>
            </FormGroup>
        )
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
                        <FontAwesomeIcon className="kategorijeIcon" icon={faListAlt}/>Artikli
                    </CardTitle>

                    <FormGroup className="d-flex formGroupFilter">
                        <FormLabel className="d-flex align-items-center m-0 "  htmlFor="keywords"><strong>Pretraži artikal:</strong></FormLabel>
                        <FormControl 
                            className="w-50 labelFilter"
                            id="keywords"
                            type="text"
                            placeholder="pretraži po nazivu..."
                            value={adminPage.filters.keywords}
                            onChange={filterKeywordsChanged}
                        />
                        <Button className="btn btnFilter" size="sm" onClick={getArticlesWithFilter}>Pretraži</Button>
                    </FormGroup>

                    <Table hover size="sm" bordered>
                        <thead>
                            <tr>
                                <th colSpan={6}></th>
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
                                <th>Kategorija</th>
                                <th>Status</th>
                                <th>Promovisan</th>
                                <th className="text-right">Cena</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminPage.articles && adminPage.articles.length > 0 ?( adminPage.articles.map  (article =>(
                                <tr key={article.articleId}>
                                    <td className="text-right">{article.articleId}</td>
                                    <td>{article.name}</td>
                                    <td>{article.category?.name}</td>
                                    <td>{article.status === 'available' ? 'Na stanju' : 
                                         article.status === 'visible' ? 'Nije na stanju' :
                                         article.status === 'hidden' ? 'Sakriven' :
                                         article.status
                                        }</td>
                                    <td>{article.isPromoted ? 'Da' : 'Ne'}</td>
                                    <td className="text-right">{article.price}</td>
                                    <td className="text-center">
                                        <Link to={'/administrator/dashboard/photo/'+article.articleId}
                                            className="btn btn-sm btn-info linkToPhoto">
                                                <FontAwesomeIcon icon={faImage}/> Fotografije
                                        </Link>
                                        <Button 
                                            onClick={() => showEditModal(article)}
                                            variant="success" size="sm">
                                            <FontAwesomeIcon icon={faEdit}/>Uredi
                                        </Button>
                                    </td>
                                </tr>
                            ),this) ) : (
                                <tr>
                                    <td>Nema artikla sa ovim nazivom</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

            <Modal size="lg" centered show={adminPage.addModal.visible} 
                    onHide={()=> setAddModalVisibleState(false)}
                    onEnter={ () => {
                        if(document.getElementById('add-photo')){
                            const filePicker: any = document.getElementById('add-photo');
                            filePicker.value = '';
                        }
                    }}>

                <ModalHeader closeButton className="vasaKorpa">
                    <ModalTitle className="">Dodaj novi artikal</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <FormLabel htmlFor="add-categoryId">Pripada kategoriji</FormLabel>
                        <FormControl id="add-categoryId" as='select' value={adminPage.addModal.categoryId.toString() || 'null'}
                                     onChange={(e) => addModalCategoryChanged(e as any)}>
                                     { adminPage.categories.map(category =>(
                                        <option key={category.categoryId} value={category.categoryId?.toString()}>
                                            { category.name }
                                        </option>
                                     )) }
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="add-name">Naziv</FormLabel>
                        <FormControl placeholder="Tekst mora sadržati između 5 i 128 karaktera" id="add-name" type="text" value={adminPage.addModal.name}
                                     onChange={(e) => 
                                     setAddModalStringFieldState('name', e.target.value)}>
                        </FormControl>
                    </FormGroup>


                    <FormGroup>
                        <FormLabel htmlFor="add-excerpt">Kratak opis</FormLabel>
                        <FormControl
                                placeholder="Tekst mora sadržati između 10 i 255 karaktera."
                                id="add-excerpt" type="text" value={adminPage.addModal.excerpt}
                                     onChange={(e) => 
                                     setAddModalStringFieldState('excerpt', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="add-description">Detaljan opis</FormLabel>
                        <p></p>
                        <FormControl placeholder="Tekst mora sadržati između 64 i 10 000 karaktera." id="add-description" as='textarea' value={adminPage.addModal.description}
                                     onChange={(e) => 
                                     setAddModalStringFieldState('description', e.target.value)}
                                     rows={ 10 }>
                                        
                        </FormControl>
                        
                    </FormGroup>

                    
                    {/*
                    <FormGroup>
                        <FormLabel htmlFor="add-status">Status</FormLabel>
                        <FormControl id="add-status" as='select' value={adminPage.addModal.status.toString() || 'null'}
                                     onChange={(e) => 
                                     setAddModalStringFieldState('status', e.target.value)}>
                                    <option value='available'>Na stanju</option>
                                     <option value='visible'>Nije na stanju</option>
                                     <option value='hidden'>Sakriven</option>
                                     {/* { adminPage.status.map(status =>(
                                        <option value={ status }>
                                            { status }
                                        </option>
                                     )) } 
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="add-isPromoted">Promovisano</FormLabel>
                        <FormControl id="add-isPromoted" as='select' value={adminPage.addModal.isPromoted.toString() || 'null'}
                                     onChange={(e) => 
                                     setAddModalNumberFieldState('isPromoted', e.target.value)}>
                                     <option value='0'>Nije promovisan</option>
                                     <option value='1'>Promovisan</option>
                        </FormControl>
                    </FormGroup>
                    */}

                    <FormGroup>
                        <FormLabel htmlFor="add-price">Cena</FormLabel>
                        <FormControl id="add-price" type="number" min={0.01} step={0.01} value={adminPage.addModal.price}
                                     onChange={(e) => 
                                     setAddModalNumberFieldState('price', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    <div>
                        {adminPage.addModal.features.map(printAddModalFeatureInput ,this)}
                    </div>

                    <FormGroup>
                        <FormLabel htmlFor="add-photo">Slika artikla</FormLabel>
                        <FormControl id="add-photo" type="file" className="mb-2"/>
                    </FormGroup>



                    <FormGroup>
                        <Button variant="primary" onClick={ () => doAddArticle() }>
                            <FontAwesomeIcon icon={faPlus}/>Dodaj novi artikal
                        </Button>
                    </FormGroup>
                    { adminPage.addModal.message ? (
                        <Alert variant="danger">
                            {adminPage.addModal.message}
                        </Alert>
                    ) : '' }
                </ModalBody>
            </Modal>

            {/* edit modal */}

            <Modal size="lg" centered show={adminPage.editModal.visible} 
                    onHide={()=> setEditModalVisibleState(false)}>

                <ModalHeader closeButton className="">
                    <ModalTitle className="">Izmeni artikal</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {/* <FormGroup>
                        <FormLabel htmlFor="edit-categoryId">Pripada kategoriji</FormLabel>
                        <FormControl id="edit-categoryId" as='select' value={adminPage.editModal.categoryId.toString() || 'null'}
                                     onChange={(e) => editModalCategoryChanged(e as any)}>
                                     { adminPage.categories.map(category =>(
                                        <option value={category.categoryId?.toString()}>
                                            { category.name }
                                        </option>
                                     )) }
                        </FormControl>
                    </FormGroup> */}

                    <FormGroup>
                        <FormLabel htmlFor="edit-name">Naziv</FormLabel><br />
                        <em className="fs-6 text-secondary">Naziv mora sadržati između 5 i 128 karaktera</em>
                        <FormControl placeholder="Tekst mora sadržati između 5 i 128 karaktera." id="edit-name" type="text" value={adminPage.editModal.name}
                                     onChange={(e) => 
                                     setEditModalStringFieldState('name', e.target.value)}>
                        </FormControl>
                    </FormGroup>


                    <FormGroup>
                        <FormLabel htmlFor="edit-excerpt">Kratak opis</FormLabel><br />
                        <em className="fs-6 text-secondary">Kratak opis sadržati između 10 i 255 karaktera</em>
                        <FormControl id="edit-excerpt" type="text" value={adminPage.editModal.excerpt}
                                     onChange={(e) => 
                                     setEditModalStringFieldState('excerpt', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="edit-description m-0 p-0">Detaljan opis</FormLabel><br />
                        <em className="fs-6 text-secondary">Detaljan opis mora sadržati između 64 i 10 000 karaktera</em>
                        <FormControl id="edit-description" as='textarea' value={adminPage.editModal.description}
                                     onChange={(e) => 
                                     setEditModalStringFieldState('description', e.target.value)}
                                     rows={ 10 }>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="edit-status">Status</FormLabel>
                        <FormControl id="edit-status" as='select' value={adminPage.editModal.status.toString() || 'null'}
                                     onChange={(e) => 
                                     setEditModalStringFieldState('status', e.target.value)}>
                                     <option value='available'>Na stanju</option>
                                     <option value='visible'>Nije na stanju</option>
                                     <option value='hidden'>Sakriven</option>
                                      {/* { adminPage.status.map(status =>(
                                        <option value={ status }>
                                            { status }
                                        </option>
                                     )) }  */}
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="edit-isPromoted">Promovisano</FormLabel>
                        <FormControl id="edit-isPromoted" as='select' value={adminPage.editModal.isPromoted.toString() || 'null'}
                                     onChange={(e) => 
                                     setEditModalNumberFieldState('isPromoted', e.target.value)}>
                                     <option value='0'>Nije promovisan</option>
                                     <option value='1'>Promovisan</option>
                        </FormControl>
                    </FormGroup>
                   

                    <FormGroup>
                        <FormLabel htmlFor="edit-price">Cena</FormLabel>
                        <FormControl id="edit-price" type="number" min={0.01} step={0.01} value={adminPage.editModal.price}
                                     onChange={(e) => 
                                     setEditModalNumberFieldState('price', e.target.value)}>
                        </FormControl>
                    </FormGroup>

                    <div>
                        {adminPage.editModal.features.map(printEditModalFeatureInput ,this)}
                    </div>

                    <FormGroup>
                        <Button variant="primary" onClick={ () => doEditArticle() }>
                            <FontAwesomeIcon icon={faSave}/>Izmeni artikal
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

export default AdministratorDashboardArticle;
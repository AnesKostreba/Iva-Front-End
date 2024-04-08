import { Form, Link, unstable_HistoryRouter, useNavigate, useParams } from "react-router-dom";
import { CategoryType } from "../../types/CategoryType";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import { ArticleType } from "../../types/ArticleType";
import api, { ApiResponse } from '../../api/api';
import { ApiConfig } from "../../config/api.config";
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { faCartShopping, faSearch } from "@fortawesome/free-solid-svg-icons";
import './CategoryPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MultiRangeSlider from "multi-range-slider-react";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { ArticlePage } from "../ArticlePage/ArticlePage";

interface CategoryPageState{
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
    filters: {
        keywords: string;
        priceMinimum: number;
        priceMaximum: number;
        order: "name asc" | "name desc" | "price asc" | "price desc";
        selectedFeatures: {
            featureId: number;
            value: string;
        }[];
    };
    features:{
        featureId: number;
        name: string;
        values: string[];
    }[];
}

interface CategoryDto{
    categoryId: number;
    name: string;
}

interface ArticleDto{
    articleId: number;
    name: string;
    isPromoted: number;
    excerpt: string;
    description: string;
    articlePrices?: {
        price: number;
        createdAt: string;
    }[],
    photos?: {
        imagePath: string
    }[]
}

export const CategoryPage = () =>{
    const {id} = useParams<{id: string}>();

    const [categoryState, setCategoryState] = useState<CategoryPageState>({
        isUserLoggedIn: true,
        message: '',
        filters: {
            keywords: '',
            priceMinimum: 0.10,
            priceMaximum: 650,
            order: "price asc",
            selectedFeatures: [],
        },
        features: [],
    }) 

    const setFeatures = (features: any) =>{
        setCategoryState(prevState =>({
            ...prevState,
            features: features
        }))
    }

    const setLogginState = (isLoggedIn: boolean) =>{
        setCategoryState(prevState =>({
            ...prevState,
            isUserLoggedIn: isLoggedIn
        }))
    }

    const setMessage = (message: string) =>{
        setCategoryState(prevState =>({
            ...prevState,
            message: message
        }))
    }

    const setCategoryData = (category: CategoryType) =>{
        setCategoryState(prevState =>({
            ...prevState,
            category: category
        }))
    }

    const setSubcategories = (subcategories: CategoryType[]) =>{
        setCategoryState(prevState =>({
            ...prevState,
            subcategories: subcategories
        }))
    }

    const setArticles = (articles: ArticleType[]) =>{
        setCategoryState(prevState =>({
            ...prevState,
            articles: articles
        }))
    }

    const printOptionalMessage = () =>{
        if(categoryState.message === ''){
            return;
        }
        return (
            <CardText>
                    {categoryState.message}
            </CardText>
        );
    }

    const showSubcategories = () =>{
        if(categoryState.subcategories?.length === 0){
            return;
        }
        return (
            <Row>
                {categoryState.subcategories && categoryState.subcategories.map(singleCategory)}
            </Row>
        )

    }

    const singleCategory = (category: CategoryType) =>{
        return(
            <Col lg='3' md='4' sm='6' xs='12' className="">
                <div className="border d-flex">
                    <Link to={`/category/${category.categoryId}`} className="d-flex justify-content-center ">
                        <img className="linkSubcategory" src={ApiConfig.PHOTO_PATH+'category/'+'apoteka-iva-pharm-i-bar.jpg'} alt="" />
                    </Link>
                    <CardTitle as='p' className="text-center titleSubcategory align-items-center d-flex">
                        {category.name}
                    </CardTitle>
                </div>
            </Col>
        )
    }

    

    const showArticles = () =>{
        if(categoryState.articles?.length === 0){
            return(
                <div>There are no articles in this category.</div>
            );
        }

        return(
            <div className="container">
                <Row>
                    { categoryState.articles?.map(singleArticle) }
                </Row>
                
            </div>
        )
    }
    const setNewFilter =(newFilter: any) =>{
        setCategoryState(prevState =>({
            ...prevState,
            filters: newFilter
        }))
    }

    const filterKeywordsChanged = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setNewFilter({
            ...categoryState.filters,
            keywords: event.target.value
        })
    }

    const filterPriceMinChanged = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setNewFilter({
            ...categoryState.filters,
            priceMinimum: Number(event.target.value)
        })
    }

    const filterPriceMaxChanged = (event: React.ChangeEvent<HTMLInputElement>) =>{
        // setNewFilter(Object.assign(setCategoryState,{
        //     priceMaximum: Number(event.target.value),
        // }));
        setNewFilter({
            ...categoryState.filters,
            priceMaximum: Number(event.target.value)
        })
    }

    const filterOrderChanged = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        // setNewFilter(Object.assign(setCategoryState,{
        //     order: event.target.value,
        // }));
        setNewFilter({
            ...categoryState.filters,
            order: event.target.value
        })
    }

    const featureFilterChanged = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const featureId = Number(event.target.dataset.featureId);
        const value = event.target.value;

        if(event.target.checked){
            addFeatureFilterValue(featureId, value)
        }else{
            removeFeatureFilterValue(featureId, value)
        }
    }

    const addFeatureFilterValue = (featureId: number, value: string) =>{
        const newSelectedFeatures = [... categoryState.filters.selectedFeatures];
        newSelectedFeatures.push({
            featureId: featureId,
            value: value,
        })
        
        setSelectedFeatures(newSelectedFeatures)
    }

    const removeFeatureFilterValue = (featureId: number, value: string) =>{
        const newSelectedFeatures = categoryState.filters.selectedFeatures.filter(record =>{
           return !(record.featureId === featureId && record.value === value)
        });
        
        setSelectedFeatures(newSelectedFeatures)
    }

    const setSelectedFeatures = (newSelectedFeatures: any) =>{
        setCategoryState(Object.assign(categoryState,{
            filters: Object.assign(categoryState.filters,{
                selectedFeatures: newSelectedFeatures
            })
        }))
        // setNewFilter({
        //     ...categoryState.filters,
        //     selectedFeatures :newSelectedFeatures
        // })

        console.log(categoryState)
    }

    const applyFilters = () =>{
        getCategoryData()
    }
    

    

    const printFilters = ()=>{

        return(
            <>
                <FormGroup className="mt-2">
                    
                    <FormLabel htmlFor="keywords">Pretrazi po nazivu:</FormLabel>
                    <FormControl type="text" id="keywords" 
                                 value={ categoryState.filters.keywords }
                                 onChange={(e)=> filterKeywordsChanged(e as any)}>
                    </FormControl>
                </FormGroup>  
                <FormGroup>
                    <Row>
                        <Col sm='12' xs='12'>
                        <FormLabel htmlFor="priceMin">Minimalna cena:</FormLabel>
                            <FormControl type="number" id="priceMin"
                                         step='0.01' min='0.01' max='9999.99'
                                         value={categoryState.filters.priceMinimum}
                                         onChange={(e)=> filterPriceMinChanged(e as any)}>

                            </FormControl>
                        </Col>
                        <Col sm='12' xs='12'>
                            <FormLabel htmlFor="priceMax">Maksimalna cena:</FormLabel>
                            <FormControl type="number" id="priceMax"
                                         step='0.01' min='0.02' max='10000'
                                         value={categoryState.filters.priceMaximum}
                                         onChange={(e)=> filterPriceMaxChanged(e as any)}>

                            </FormControl>
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <FormLabel className="mt-2">Sortiraj po:</FormLabel>
                    <FormSelect as='select' id='sortOrder' className=" formSelectSort"
                                 value={categoryState.filters.order}
                                 onChange={(e)=> filterOrderChanged(e as any)}>

                        <option value="name asc" selected >Sortiraj po nazivu - rastuce</option>
                        <option value="name desc">Sortiraj po nazivu - opadajuce</option>
                        <option value="price asc">Sortiraj po ceni - rastuce</option>
                        <option value="price desc">Sortiraj po ceni - opadajuce</option>
                    </FormSelect>
                </FormGroup>

                { categoryState.features && categoryState.features.map(printFeatureFilterComponent, this) }

                <FormGroup>
                    {/* <Button variant="primary" className="w-100" onClick={() => applyFilters()}>
                        <FontAwesomeIcon icon={faSearch}/> Search
                    </Button> */}
                    <div className="divSearchFeatures d-flex w-100">
                        <button onClick={() => applyFilters()} className="btnSearchFeatures p-1 w-100 d-flex align-items-center justify-content-center ">
                            <FontAwesomeIcon className="icon" icon={faSearch}/>Pretrazi</button>
                    </div>
                    
                </FormGroup>
            </>
        );
    }

    const printFeatureFilterComponent =(feature: {
        featureId: number;
        name: string;
        values: string[];})=>{

            return(
                <>
                <FormLabel className="mt-2">
                        <strong>{feature.name}</strong>
                </FormLabel>
                <div className="checkbox">
                <FormGroup className="">
                    
                    { feature.values.map(value => printFeatureFilterCheckBox(feature, value), this) }
                </FormGroup>
                </div>
                </>
            );
    }

    const printFeatureFilterCheckBox = (feature: any, value: string) =>{
        return (
            
            <FormCheck type="checkbox" label={value}
                                       value={value}
                                       data-feature-id = {feature.featureId}
                                       onChange={(event: any)=> featureFilterChanged(event as any)}/>
            
        )
        
    }


    
    const navigete = useNavigate();

    const singleArticle = (article: ArticleType) =>{

        const handleArticleClick = (articleId: number | undefined)=>{
            navigete(`/article/${articleId}`)
        }

        return(
            <Col lg='3' md='4' xl='3' xxl='3' sm='6' xs='6' className="cards p-1">
                <Card className="mb-3 containerArticle text-center" onClick={()=>handleArticleClick(article.articleId)}>
                {/* <Link to={`article/${article.articleId}`}
                      className="btn btn-block btn-sm linkArticle"> */}

                        <img src={ApiConfig.PHOTO_PATH + 'small/' + article.imageUrl} 
                             alt={article.name}
                             className="w-100" />
                    
                    <CardTitle as='p' className="mt-4 nameArticle">
                            <strong>{article.name}</strong>
                    </CardTitle>
                {/* </Link> */}
                    <CardBody className="cardBody">
                        
                        {/* <CardText>
                            {article.excerpt}
                        </CardText> */}
                        <CardText className="text-center cardPrice">
                            Cijena: { Number(article.price)?.toFixed(2)} EUR
                        </CardText>
                        <div className="container wrapper">
                            <div className="prviDiv d-flex align-items-center">
                                <div className="minusDiv w-100 align-items-center justify-content-center text-center">
                                    <button className="povecajSmanji minus p-0 w-100 d-flex justify-content-center">-</button>
                                    {/* <div className="btn povecajSmanji minus p-0 w-100 d-flex justify-content-center">-</div> */}
                                </div>
                                <div className="w-100 text-center">
                                    <p className="p-0  m-0 text-center">1</p>
                                </div>
                                <div className="w-100 minusDiv">
                                    <button className="povecajSmanji plus p-0 w-100 d-flex justify-content-center">+</button>
                                    {/* <div className="btn povecajSmanji plus p-0 w-100 d-flex justify-content-center">+</div> */}
                                </div>
                            </div>
                            <div className="drugiDiv d-flex">
                                <button className="btnKupi p-0 w-100 d-flex align-items-center justify-content-center ">Kupi</button>
                                {/* <div className="btn p-0 kupi w-100 d-flex justify-content-center">Kupi</div> */}
                            </div>
                        </div>
                    </CardBody>
                    
                </Card>
            </Col>
        )
    }

    useEffect(()=>{
        getCategoryData()
    },[id])


    const getCategoryData = () =>{
        
        api('api/category/'+ id, 'get',{})
        .then((res:ApiResponse | undefined) =>{
            if(res?.status === 'login'){
                return setLogginState(false)
            }
            if(res?.status === 'error'){
                return setMessage('Request error. Please try to refresh page.')
            }

            const categoryData: CategoryType ={
                categoryId: res?.data.categoryId,
                name: res?.data.name
            }
            setCategoryData(categoryData);

            if(res?.data && res.data.categories){
            const subcategories: CategoryType[] = 
                            res?.data.categories.map((category: CategoryDto)=>{
                                return{
                                    categoryId: category.categoryId,
                                    name: category.name
                                }
                            });
            setSubcategories(subcategories)
            }else{
                JSON.stringify('No categories found in response data.')
            }
        })

        const orderParts = categoryState.filters.order ? categoryState.filters.order.split(' ') : [];
        const orderBy = orderParts.length > 0 ? orderParts[0] : '';
        const orderDirection = orderParts.length > 1 ? orderParts[1].toLocaleUpperCase() : '';
        // const orderParts = categoryState.filters.order.split(' ');
        // const orderBy = orderParts[0];
        // const orderDirection = orderParts[1].toLocaleUpperCase();

        const featureFilters: any[] = [ ];
        for(const item of categoryState.filters.selectedFeatures){
            let found = false;
            let foundReference = null;

            for( const featureFilter of featureFilters){
                if(featureFilter.featureId === item.featureId){
                    found = true;
                    foundReference = featureFilter;
                    break;
                }
            }

            if(!found){
                featureFilters.push({
                    featureId: item.featureId,
                    values: [item.value]
                })
            }else{
                foundReference.values.push(item.value)
            }
        }

        api('api/article/search/', 'post', {
            categoryId: Number(id),
            keywords: categoryState.filters.keywords,
            priceMin: categoryState.filters.priceMinimum,
            priceMax: categoryState.filters.priceMaximum,
            features: featureFilters,
            orderBy: orderBy,
            orderDirection: orderDirection
        })
        .then((res:ApiResponse | undefined) =>{
            if(res?.status === 'login'){
                return setLogginState(false)
            }
            if(res?.status === 'error'){
                return setMessage('Request error. Please try to refresh page. Error: '+ JSON.stringify(res) )
            }

            if(res && Array.isArray(res.data)){
            const articles: ArticleType[] =
            res?.data.map((article: ArticleDto)=>{
                
                const object: ArticleType = {
                    articleId: article.articleId,
                    name:  article.name,
                    excerpt:  article.excerpt,
                    description:  article.description,
                    imageUrl:  '',
                    price:  0,
                }
                if(article.photos !== undefined && article.photos?.length > 0){
                    object.imageUrl = article.photos[article.photos?.length-1].imagePath;
                }
                if(article.articlePrices !== undefined && article.articlePrices?.length > 0){
                    object.price = article.articlePrices[article.articlePrices?.length-1].price;
                }

                return object;
            });

            setArticles(articles)
        }else{
            // console.error('res.data nije niz ili nije definisan')
        }
        })

        getFeatures();
    }


    const getFeatures = () =>{
        api('api/feature/values/' + id, 'get', {})
        .then((res:ApiResponse | undefined) =>{
            if(res?.status === 'login'){
                return setLogginState(false)
            }
            if(res?.status === 'error'){
                return setMessage('Request error. Please try to refresh page. Error: '+ JSON.stringify(res) )
            }

            setFeatures(res?.data.features);
        })
    }



    return(
        
        <div className="container-fluid d-flex mt-3 p-0">
            <Container>
                <div className="row">
                    <CardTitle className="mb-3 subcategoryName">
                        {categoryState.category?.name}
                    </CardTitle>
                </div>
                    {printOptionalMessage()}
                    { showSubcategories() }
                <div className="row">
                    <div className=" col-xs-12 col-md-3 col-lg-3 filter">
                        {printFilters()}
                    </div>
                    <div className=" col-xs-12 col-md-9 col-lg-9 articlesCol">    
                        {showArticles()}
                    </div>
                </div>
            </Container>
        </div>
    )
}
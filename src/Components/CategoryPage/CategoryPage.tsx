import { Link,  useParams } from "react-router-dom";
import { CategoryType } from "../../types/CategoryType";
import { useEffect, useState } from "react";
import { CardText, CardTitle, Col, Container, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row } from "react-bootstrap";
import { ArticleType } from "../../types/ArticleType";
import api, { ApiResponse } from '../../api/api';
import { ApiConfig } from "../../config/api.config";
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import './CategoryPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProductCard } from "../ProductCard/ProductCard";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";

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
        const scroll = () =>{
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }

        return(
            <Col key={category.categoryId} lg='3' md='4' sm='6' xs='12' className="">
                <div className="border d-flex">
                    <Link to={`/category/${category.categoryId}`}  onClick={scroll} className="d-flex justify-content-center ">
                        <img className="linkSubcategory" src={ApiConfig.PHOTO_PATH+'category/'+'apoteka-iva-pharm-i-bar.jpg'} alt="" />
                    </Link>
                    <CardTitle  as='p' className="text-center titleSubcategory align-items-center d-flex">
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
            <div className="container ">
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
    }

    const applyFilters = () =>{
        getCategoryData()
    }
    

    

    const printFilters = ()=>{

        return(
            <div className="featuresSearch">
                <FormGroup className="mt-2">
                    
                    <FormLabel htmlFor="keywords">Pretrazi po nazivu:</FormLabel>
                    <FormControl type="text" id="keywords" 
                                 value={ categoryState.filters.keywords }
                                 onChange={(e)=> filterKeywordsChanged(e as any)}>
                    </FormControl>
                </FormGroup>  
                <FormGroup>
                    <FormLabel className="mt-2">Sortiraj po nazivu:</FormLabel>
                    <FormSelect as='select' id='sortOrder' className=" formSelectSort"
                                 value={categoryState.filters.order}
                                 onChange={(e)=> filterOrderChanged(e as any)}>

                        <option value="name asc" >Sortiraj po nazivu  (A - Z)</option>
                        <option value="name desc">Sortiraj po nazivu  (Z - A)</option>
                        
                    </FormSelect>
                </FormGroup>
                <FormGroup>
                    <FormLabel className="mt-2">Sortiraj po ceni:</FormLabel>
                    <FormSelect as='select' id='sortOrder' className="formSelectSort mb-2"
                                value={categoryState.filters.order}
                                onChange={(e)=> filterOrderChanged(e as any)}>
                            <option value="price asc">Sortiraj po ceni - rastuce</option>
                            <option value="price desc">Sortiraj po ceni - opadajuce</option>
                    </FormSelect>
                </FormGroup>

                    {categoryState.features && categoryState.features.map(feature =>(
                        <div key={feature.featureId}>
                            {printFeatureFilterComponent(feature)}
                        </div>
                    ))}
                    {/* { categoryState.features && categoryState.features.map(printFeatureFilterComponent, this) } */}

                <FormGroup>
                    <div className="divSearchFeatures d-flex w-100">
                        <button onClick={() => applyFilters()} className="btnSearchFeatures p-1 w-100 d-flex align-items-center justify-content-center ">
                            <FontAwesomeIcon className="icon" icon={faSearch}/>Pretrazi</button>
                    </div>
                </FormGroup>
            </div>
        );
    }

    const printFeatureFilterComponent =(feature: {
        featureId: number;
        name: string;
        values: string[];})=>{

            return(
                <>
                <FormLabel  className="mt-2">
                        <strong>{feature.name}</strong>
                </FormLabel>
                <div className="checkbox">
                    <FormGroup  className="">   
                        {feature.values.map((value, index) => (
                            <div key={`${feature.featureId}-${value}-${index}`}>
                                {printFeatureFilterCheckBox(feature, value)}
                            </div>
                        ))}
                        {/* { feature.values.map(value => printFeatureFilterCheckBox(feature, value), this) } */}
                    </FormGroup>
                </div>
                </>
            );
    }

    const printFeatureFilterCheckBox = (feature: any, value: string) =>{
        return (
            
            <FormCheck 
                    key={`${feature.featureId}-${value}`}
                    type="checkbox" label={value}
                    value={value}
                    data-feature-id = {feature.featureId}
                    onChange={(event: any)=> featureFilterChanged(event as any)}/>
            
        )
        
    }


    
    // const navigete = useNavigate();

    const singleArticle = (article: ArticleType) =>{

        // const handleArticleClick = (articleId: number | undefined)=>{
        //     navigete(`/article/${articleId}`)
        // }

        return(
                <Col key={article.articleId} className="p-0 omotac" lg='3' md='4' xl='3' xs='6'>
                        <ProductCard article={article}/>
                </Col>
        )
    }

    useEffect(()=>{
        getCategoryData()
    },[id])


    const getCategoryData = () =>{
        
        api('api/category/'+ id, 'get',{})
        .then((res:ApiResponse | undefined) =>{
            // if(res?.status === 'login'){
            //     return setLogginState(false)
            // }
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
            // if(res?.status === 'login'){
            //     return setLogginState(false)
            // }
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
            // if(res?.status === 'login'){
            //     return setLogginState(false)
            // }
            if(res?.status === 'error'){
                return setMessage('Request error. Please try to refresh page. Error: '+ JSON.stringify(res) )
            }

            setFeatures(res?.data.features);
        })
    }



    return(
        <>
        <RoledMainMenu role="user"/>
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
        </>
    )
}
import { Link, useParams } from "react-router-dom";
import { CategoryType } from "../../types/CategoryType";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, Row } from "react-bootstrap";
import { ArticleType } from "../../types/ArticleType";
import api, { ApiResponse } from '../../api/api';
import { ApiConfig } from "../../config/api.config";
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import './CategoryPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CategoryPageState{
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
}

interface ArticleDto{
    articleId: number;
    name: string;
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
        message: ''
    }) 

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

    const singleArticle = (article: ArticleType) =>{
        return(
            <Col lg='3' md='4' xl='3' xxl='3' sm='6' xs='6' className="cards p-1">
                <Card className="mb-3 containerArticle">
                <Link to={`article/${article.articleId}`}
                      className="btn btn-block btn-sm linkArticle">

                        <img src={ApiConfig.PHOTO_PATH + 'small/' + article.imageUrl} 
                             alt={article.name}
                             className="w-100" />
                    
                    <CardTitle as='p' className="mt-4">
                            <strong>{article.name}</strong>
                    </CardTitle>
                </Link>
                    <CardBody className="cardBody">
                        
                        {/* <CardText>
                            {article.excerpt}
                        </CardText> */}
                        <CardText className="text-center cardPrice">
                            Price: { Number(article.price)?.toFixed(2)} EUR
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
        })

        api('api/article/search/', 'post', {
            categoryId: Number(id),
            keywords: "",
            priceMin: 0.01,
            priceMax: Number.MAX_SAFE_INTEGER,
            features: []
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
            console.error('res.data nije niz ili nije definisan')
        }
        })
    },[])



    return(
        
        <div className="container-fluid d-flex mt-3 p-0">
            <Container>
                <div className="row">
                    <CardTitle className="mb-3">
                        {categoryState.category?.name}
                    </CardTitle>
                </div>
                    {printOptionalMessage()}
                <div className="row">
                    <div className="col-3 col-md-2 col-sm-3 col-lg-3 filter">
                        a
                    </div>
                    <div className="col-9 col-md-10 col-sm-9 col-lg-9 articlesCol">    
                        {showArticles()}
                    </div>
                </div>
            </Container>
        </div>
    )
}
import { Link, useNavigate } from 'react-router-dom';
import { CategoryType } from '../../types/CategoryType';
import './HomePage.css'
import { useEffect, useState } from 'react';
import api, { ApiResponse } from '../../api/api';
import { Card, CardTitle, Col, Container, Row } from 'react-bootstrap';
import 'react-multi-carousel/lib/styles.css';
import banerPopust from './Image/BanerPopustPenzioneriDesktop.jpg'
import Carousel from 'react-bootstrap/Carousel';
import Carousell from "react-multi-carousel";
import { ApiConfig } from '../../config/api.config';
import { ArticleType } from '../../types/ArticleType';
import { ProductCard } from '../ProductCard/ProductCard';
import { RoledMainMenu } from '../RoledMainMenu/RoledMainMenu';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faSheetPlastic } from '@fortawesome/free-solid-svg-icons';


interface ArticleTypee{
    articleId?: number;
    name?: string;
    excerpt?: string;
    status?: "available" | "visible" | "hidden";
    description?: string;
    imageUrl?: string;
    price?: number;
    isPromoted: number;
}
interface ArticleDto{
    articleId?: number;
    name?: string;
    isPromoted: number;
    status?: "available" | "visible" | "hidden";
    excerpt?: string;
    description?: string;
    articlePrices?:{
        articleId?: number;
        price?: number;
    }[];
    photos?:{
        imagePath?: string;
    }[]
}

interface HomePageState{
    isUserLoggedIn: boolean;
    categories: CategoryType[];
}



export const HomePage = () =>{
    const navigate = useNavigate();
    const [article, setArticles] = useState<ArticleType[]>();

    const[homePageState, setHomePageState] = useState<HomePageState>({
        isUserLoggedIn: true,
        categories: [],
    })

    // if(homePageState.isUserLoggedIn === false){
    //     navigate('/user/login')
    //     return null;
    // }

    useEffect(()=>{
        // if(homePageState.isUserLoggedIn === false){
        //     navigate('/user/login');
        if(homePageState.categories.length === 0){ // Provera da li su kategorije vec ucitane
            getCategories();
        }
    })

    const getCategories = () =>{
        api('api/category/?filter=parentCategoryId||$isnull','get',{})
            .then((res: ApiResponse | undefined) =>{
                if(res?.status === 'error' || !Array.isArray(res?.data)){
                    setLogginState(false);
                    return;
                }
                putCategoriesInState(res?.data as ApiCategoryDto[])
                
            })
    }

    const putCategoriesInState = (data: ApiCategoryDto[]) =>{
        const categories: CategoryType[] = data.map(category =>{
            return{
                categoryId: category.categoryId,
                name:       category.name,
                imagePath: category.imagePath,
                items:      [] // artikli
            };
        });

        setHomePageState(prevState => ({
            ...prevState,
            categories: categories
        }))
    }

    const setLogginState = (isLoggedIn: boolean) =>{
        setHomePageState(prevState =>({
            ...prevState,
            isUserLoggedIn: isLoggedIn
        }))
    }

    const scrollToTop = () =>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const singleCategory = (category: CategoryType) =>{
        return(
            <div className='divBody'>
                <CardTitle className='mb-2'>
                        {category.name}
                </CardTitle>
                <Link to={`/category/${category.categoryId}`} onClick={scrollToTop} className=''>
                    <img className='imageCategory' src={ApiConfig.PHOTO_PATH+'category/'+category.imagePath}></img>
                    
                </Link>
                
            </div>
        )
    }
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1432 },
            items: 5,
            },
        tablet: {
            breakpoint: { max: 1432, min: 664 },
            items: 5,
            },
        mobile: {
            breakpoint: { max: 664, min: 0 },
            items: 2,
            },
    }

    const responsiveIzdvajamo = {
        desktop: {
            breakpoint: { max: 3000, min: 1432 },
            items: 5,
            },
        tablet: {
            breakpoint: { max: 1432, min: 664 },
            items: 4,
            },
        mobile: {
            breakpoint: { max: 664, min: 0 },
            items: 2,
            },
    }

    const baneri =[
        {name: 'stavka 1', id: 1},
    ];

    const setArticle = () =>{
        if(!article || article.length === 0 ){
            return <div>Nema artikala</div>
        }

        return(
            <Container className='izdvajamo'>
                <Carousell 
                    responsive={responsiveIzdvajamo}
                    autoPlay= {true}
                    autoPlaySpeed={5000}
                    infinite= {true}
                    arrows={true}>
                    {article.map((article, index) => (
                        <Col key={index} className='mb-3 d-flex justify-content-center'>
                            <ProductCard article={article}/>
                        </Col>
                    ))}
                </Carousell>
            </Container>
        )
    }

    useEffect(()=>{
        showArticles()
    },[])

    const validStatus:('available' | 'visible' | 'hidden')[] = ['available', 'visible', 'hidden']

    const showArticles = () =>{
        api('api/article','get',{})
            .then((res: ApiResponse | undefined)=>{
                
                if(res && Array.isArray(res.data)){

                    const articles:ArticleTypee[] =
                        res.data.map((article:ArticleDto)=>{
                            const status = validStatus.includes(article.status as any) ? article.status as 'available' | 'visible' | 'hidden' : undefined;
                            const object:ArticleTypee = {
                                articleId: article.articleId,
                                description: article.description,
                                excerpt: article.excerpt,
                                imageUrl: '',
                                status: status,
                                name: article.name,
                                price: 0,
                                isPromoted: article.isPromoted
                            }

                            if(article.photos !== undefined && article.photos.length > 0){
                                object.imageUrl = article.photos[article.photos.length-1].imagePath;
                            }
                            if(article.articlePrices !== undefined && article.articlePrices.length > 0){
                                object.price = article.articlePrices[article.articlePrices.length-1].price;
                            }

                            return object;
                        })
                        .filter(article => article.isPromoted === 1)
                        .slice(0,10)

                        // console.log('Processed articles', articles)
                    
                    setArticles(articles)
                }
            })
            .catch(err =>{
                console.log('Error fetching articles: ',err)
            })
    }
    
    
    return(
        <>
        <RoledMainMenu role='user'/>
        <div className="HomePage">
            <div className='baneri mt-2'>
                <Carousel >
                    <Carousel.Item>
                        <img src={banerPopust} alt="" className='banerImg'/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={banerPopust} alt="" className='banerImg'/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={banerPopust} alt="" className='banerImg'/>
                    </Carousel.Item>
                </Carousel>
            </div>

            <Card.Title className='text-center kategorijeP'>
                <p><FontAwesomeIcon className='listIcon' icon={faClipboardList}/>KATEGORIJE</p>
            </Card.Title>

            <div className="kategorije mb-4">
                <Carousell
                    responsive={responsive}
                    autoPlay= {true}
                    autoPlaySpeed={4000}
                    infinite= {true}
                    arrows={true}
                >

                    {homePageState.categories.map(category => (
                        <div key={category.categoryId}>
                            {singleCategory(category)}
                        </div>
                    ))}
                </Carousell>
            </div>

            <Card.Title className='text-center mt-2'>
                <div className='izdvajamoP'>
                    <p><FontAwesomeIcon className='listIcon' icon={faSheetPlastic}/>IZDVAJAMO IZ PONUDE</p>
                </div>
                
                <Row className=''>
                    {setArticle()}
                </Row>
            </Card.Title>
        </div>
        </>
    )
}
import { Link, useNavigate } from 'react-router-dom';
import { CategoryType } from '../../types/CategoryType';
import './HomePage.css'
import { useEffect, useState } from 'react';
import api from '../../api/api';
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
import ApiArticleDto from '../../dtos/ApiArticleDto';



interface HomePageState{
    isUserLoggedIn: boolean;
    categories: CategoryType[];
}



export const HomePage = () =>{
    const [article, setArticles] = useState<ArticleType[]>();

    const[homePageState, setHomePageState] = useState<HomePageState>({
        isUserLoggedIn: true,
        categories: [],
    })

    useEffect(()=>{
        if(homePageState.categories.length === 0){ // Provera da li su kategorije vec ucitane
            getCategories();
        }
    }, [homePageState.categories.length])

    const getCategories = async () => {
        try {
            const res = await api('api/category/?filter=parentCategoryId||$isnull', 'get', {});
            if (res?.status === 'error' || !Array.isArray(res?.data)) {
                setLogginState(false);
                return;
            }
            putCategoriesInState(res.data as ApiCategoryDto[]);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setLogginState(false);
        }
    };

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
                <CardTitle className='mb-2 titleCategory'>
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
            breakpoint: { max: 3000, min: 1232 },
            items: 5,
            },
        tablet: {
            breakpoint: { max: 1232, min: 750 },
            items: 4,
            },
        mobile: {
            breakpoint: { max: 750, min: 0 },
            items: 2,
            },
    }

    const responsiveIzdvajamo = {
        desktop: {
            breakpoint: { max: 3000, min: 1232 },
            items: 5,
            },
        tablet: {
            breakpoint: { max: 1232, min: 750 },
            items: 4,
            },
        mobile: {
            breakpoint: { max: 750, min: 0 },
            items: 2,
            },
    }

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

    const showArticles = async () => {
        try {
            const res = await api('api/article', 'get', {});
            if (res && Array.isArray(res.data)) {
                const articles: ArticleType[] = res.data.map((article: ApiArticleDto) => {
                    const status = validStatus.includes(article.status as any) ? article.status as 'available' | 'visible' | 'hidden' : undefined;
                    const object: ArticleType = {
                        articleId: article.articleId,
                        description: article.description,
                        excerpt: article.excerpt,
                        imageUrl: '',
                        status: status,
                        name: article.name,
                        price: 0,
                        isPromoted: article.isPromoted
                    };

                    if (article.photos && article.photos.length > 0) {
                        object.imageUrl = article.photos[article.photos.length - 1].imagePath;
                    }
                    if (article.articlePrices && article.articlePrices.length > 0) {
                        object.price = article.articlePrices[article.articlePrices.length - 1].price;
                    }

                    return object;
                }).filter(article => article.isPromoted === 1).slice(0, 10);

                setArticles(articles);
            }
        } catch (err) {
            console.error('Error fetching articles:', err);
        }
    };
    
    
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
                
                <Row className='m-0'>
                    {setArticle()}
                </Row>
            </Card.Title>
        </div>
        </>
    )
}
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleType } from '../../types/ArticleType';
import { Container, Row, Col, CardTitle, CardBody} from 'react-bootstrap';
import { ApiConfig } from '../../config/api.config';
import api, { ApiResponse } from '../../api/api';
import './ArticlePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CategoryType } from '../../types/CategoryType';
import { ProductCard } from '../ProductCard/ProductCard';
import Carousell from "react-multi-carousel";

interface ArticleDto{
    articleId: number,
    name: string,
    excerpt: string,
    description: string,
    status: string,
    photos:{
        imagePath: string;
    }[],
    articlePrices:{
        price: number;
        createdAt: string;
    }[]
}

export const ArticlePage = ()=>{

    const {id} = useParams()
    const [article, setArticle] = useState<ArticleType>();
    const [category, setCategory] = useState<CategoryType>();
    const [articles, setArticles] = useState<ArticleType[] >();
    const [quantity, setQuantity] = useState<number>(1)
    const navigate = useNavigate()

    const setMessage = (message: string)=>{
        setArticle(prevState =>({
            ...prevState,
            message: message
        }))
    }

    const slicniProizvodi = () =>{
        const scrollToSimilar = document.getElementById('slicniProizvodi')
        scrollToSimilar?.scrollIntoView({behavior: 'smooth'})
    }

    const opisProizvoda = () =>{
        const scrollToFeature = document.getElementById('opisProizvoda')
        scrollToFeature?.scrollIntoView({behavior:'smooth'})
    }

    const showFeatureArticle = () =>{

        return(
            <Container className='w-100 d-flex wrapperFeature'>
                <Row className='rowButtons'>
                    <Col className='p-0 m-0 buttons'>
                        <button onClick={opisProizvoda} className='buttonOpis'>Opis proizvoda</button>
                        <button onClick={slicniProizvodi} className='buttonOpis'>Slični proizvodi</button>
                    </Col>
                </Row>
            </Container>
        )
    }

    const showArticles = () => {
        
        if (!articles || articles.length === 0) {
            return <div>Nema artikala</div>;
        }
        const handleClick = (articleId:number | undefined)=>{
            navigate(`/article/${articleId}`)
            window.scroll({top: 0, behavior: 'smooth'})
        }

        // articles.map((article)=>{
        //     if(article.articleId === id){
        //         return;
        //     }
        // })

        const responsiv = {
            desktop: {
                breakpoint: { max: 3000, min: 1432 },
                items: 4,
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
    
        return (
            <Container >
                <h3 id='slicniProizvodi' className='text-center mt-3 slicniProizvodi'>Slicni proizvodi</h3>
                
                    <Carousell
                        responsive={responsiv}
                        autoPlay={true}
                        autoPlaySpeed={5000}
                        infinite={true}
                        pauseOnHover={true}
                    >
                        {articles.map((article, index) => (
                        <Col className='mb-3 d-flex justify-content-center' key={index} >
                            <ProductCard article={article}/>
                        </Col>
                    ))}
                    </Carousell>
            </Container>
        );
    };

    const showFeature = () =>{
        return(
            <Container className='border p-4' id='opisProizvoda'>
                <CardTitle className='mb-3 titleFeature'>
                    {article?.name}
                </CardTitle>
                <CardBody className='titleFeature w-50'>
                    {article?.excerpt}
                    
                </CardBody>
            </Container>
        )
    }

    useEffect(()=>{
        getArticle()
    },[id])

    const getArticle = async ()=>{
        try{
        await api(`api/article/${id}`,'get',{})
            .then((res:ApiResponse | undefined)=>{
                if(res?.status === 'error'){
                    return setMessage('Request error. Please try to refresh page')
                }
                const data = res?.data
                
                if(data){
                    const fetchArticle:ArticleType = {
                        articleId: data.articleId,
                        description: data.description,
                        excerpt: data.excerpt,
                        imageUrl: '',
                        name: data.name,
                        status: data.status,
                        price: 0
                    }

                    if(data.photos !== undefined && data.photos.length > 0){
                        fetchArticle.imageUrl = data.photos[data.photos.length-1].imagePath;
                    }
                    if(data.articlePrices !== undefined && data.articlePrices.length > 0){
                        fetchArticle.price = data.articlePrices[data.articlePrices.length-1].price;
                    }

                    setArticle(fetchArticle)

                    const categoryData:CategoryType ={
                        categoryId: data.category.categoryId,
                        name: data.category.name,
                    } 
                    setCategory(categoryData)
                }
            })
        }catch(error){
            console.error('Error fetching data:', error);
            setMessage('Error fetching data. Please try to refresh page!')
        }
    }



    useEffect(()=>{
        const fetchArticles = async () =>{
            try{
            if(category && category.categoryId){
                const categoryId = category.categoryId;
                    if(typeof categoryId === 'number' && categoryId > 0){
                       await api('api/article/search', 'post',{
                            categoryId: category?.categoryId,
                            keywords: '',
                            priceMin: 0.1,
                            priceMax: Number.MAX_SAFE_INTEGER,
                            features: []
                        })
                            .then((res: ApiResponse | undefined)=>{
                                if(res?.status === 'error'){
                                    return setMessage('Try to refresh page!')
                                }
                                const fetchArticles: ArticleType[] =
                                    res?.data.map((article: ArticleDto)=>{
                                        const object:ArticleType = {
                                            articleId: article.articleId,
                                            name: article.name,
                                            excerpt: article.excerpt,
                                            description: article.description,
                                            imageUrl: '',
                                            price: 0,
                                        }

                                        if(article.photos !== undefined && article.photos.length > 0){
                                            object.imageUrl = article.photos[article.photos.length-1].imagePath
                                        }
                                        if(article.articlePrices !== undefined && 
                                                        article.articlePrices.length > 0){
                                            object.price = article.articlePrices[
                                                article.articlePrices.length-1].price
                                        }
                                        return object;
                                    }).slice(0,7)
                                setArticles(fetchArticles)
                            })
                }
            }
        
            }catch(error){
                console.error('Error fetching data: ',error);
                setMessage('Error fetching data. Please try again later.')
            }
        }
    
        fetchArticles()
    },[category?.categoryId])
    

    const decrementQuantity = () =>{
        if(quantity > 1){
            setQuantity(prevQuantity => prevQuantity -1 )
        }
    }

    const incrementQuantity = () =>{
        setQuantity(prevQuantity => prevQuantity + 1 )
    }

    const addToCart = () =>{
        const data = {
            articleId: article?.articleId,
            quantity: quantity
        }

        api('/api/user/cart/addToCart/','post',data)
            .then((res: ApiResponse | undefined)=>{
                if(res?.status === 'error'){
                    return;
                }

                window.dispatchEvent(new CustomEvent('cart.update'))
            })
        
    }

    const showStatus = () =>{
        if(article?.status === 'available'){
            return(
                <div><FontAwesomeIcon icon={faCheck}/> Na stanju</div>
            )
        }else if(article?.status === 'visible'){
            return(
                <div> <FontAwesomeIcon icon={faXmark}/> Proizvod nije na stanju</div>
            )
        }
    }

    return (
        <Container className='mt-3'>
            <Row className=''>
                <CardTitle className=' articleName'>
                        <h2 className=''>{article?.name}</h2>
                    </CardTitle>
                <Col md='6' lg='6' className='border border-1 justify-content-center d-flex img pt-3 pb-3'>
                    <img src={ApiConfig.PHOTO_PATH + 'medium/' + article?.imageUrl} alt={article?.name}/>
                </Col>
                <Col md='6' lg='6' className='border border-1 p-0 kolona'>
                    <CardTitle className='text-center p-3 mb-3 articleNameMobile'>
                        <h2>{article?.name}</h2>
                    </CardTitle>
                    <div className='status p-3'>
                        {showStatus()}
                    </div>
                    <div className='w-100 d-flex wrapper'>
                        <div className='w-100 text-center cenaDiv align-items-center d-flex justify-content-center'>
                            {article?.price} EUR
                        </div>

                        <div className='w-100 p-3 d-flex flex-column justify-content-center align-items-center'>
                            <div className='d-flex kolicina border justify-content-center align-items-center mb-1'>
                                <div className='w-100 d-flex justify-content-center'>
                                    <button onClick={decrementQuantity} className='w-100 border'>-</button>
                                </div>
                                <div className='w-100 d-flex justify-content-center text-center align-items-center'>
                                    <p className='p-0 m-0'>{quantity}</p>
                                </div>
                                <div className='w-100 d-flex justify-content-center'>
                                    <button onClick={incrementQuantity} className='w-100 border'>+</button>
                                </div>
                            </div>
                            <div className='kupiBtn justify-content-center d-flex'>
                                <button onClick={addToCart} className='btn btn-success buttonKupi'>
                                    <FontAwesomeIcon icon={faCartShopping}/> Kupi
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </Col>
            </Row>
            <Row>
                {showFeatureArticle()}
            </Row>
            <Row>
                {showFeature()}
            </Row>
            <Row className='border'>   
                {showArticles()}
            </Row>
        </Container>
    )

}
// import { useNavigate, useParams } from "react-router-dom"
// import ApiArticleDto from "../../dtos/ApiArticleDto";
// import { useEffect, useState } from "react";
// import api, { ApiResponse } from "../../api/api";
// import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";
// import { Button, CardBody, CardTitle, Col, Container, Row, Spinner } from "react-bootstrap";
// import { ApiConfig } from "../../config/api.config";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCartShopping, faCheck, faForward, faLeftLong, faRightLeft, faRightLong, faXmark } from "@fortawesome/free-solid-svg-icons";
// import Carousell from "react-multi-carousel";
// import './ArticlePage.css'
// import { ArticleType } from "../../types/ArticleType";
// import { ProductCard } from "../ProductCard/ProductCard";
// import { CategoryType } from "../../types/CategoryType";

// interface FeatureData {
//     name: string;
//     value: string;
// }
// interface ArticlePageState{
//     isUserLoggedIn: boolean;
//     message: string;
//     article?: ApiArticleDto;
//     features: FeatureData[];
// }


// export const ArticlePage = () =>{
//     const navigate = useNavigate();
//     const [isLoading, setLoading] = useState(false);
//     const [quantity, setQuantity] = useState<number>(1);
//     const [category, setCategory] = useState<CategoryType>();
//     const {id} = useParams();
//     const [articleState, setArticleState] = useState<ArticlePageState>({
//         isUserLoggedIn: true,
//         message: '',
//         features: [],
//     })
//     const [articles, setArticles] = useState<ArticleType[] >();

//     const setLogginState = (isLoggedIn: boolean) =>{
//         setArticleState(prevState =>({
//             ...prevState,
//             isUserLoggedIn: isLoggedIn
//         }))
//     }

//     const setMessage = (message: string) =>{
//         setArticleState(prevState =>({
//             ...prevState,
//             message: message
//         }))
//     }


//     const setArticleData = (articleData: ApiArticleDto | undefined) =>{
//         setArticleState(prevState =>({
//             ...prevState,
//             article: articleData
//         }))
//     }

//     const setFeatureData = (features: FeatureData[] | undefined) =>{
//         setArticleState(prevState =>({
//             ...prevState,
//             features: {
//                 ...prevState.features,
//                 features: features
//             }
//         }))
//     }
    

//     const getArticleData = () => {
//         api('/api/article/'+id, 'get', {})
//             .then((res: ApiResponse) => {
//                 if(res.status === 'login'){
//                     setLogginState(false);
//                     return;
//                 }
//                 if(res.status === 'error'){
//                     setFeatureData([]);
//                     setArticleData(undefined);
//                     setMessage('Ne postoji artikal!');
//                     return;
//                 }
    
//                 const data:ApiArticleDto = res.data;
                
//                 if(data){
//                     setMessage('');
//                     setArticleData(data);
//                 }
                
    
//                 const categoryData:CategoryType = {
//                     categoryId: data.category?.categoryId,
//                     name: data.category?.name,
//                 } 
//                 setCategory(categoryData);
    
//                 const features:FeatureData[] = []; 
//                 if(!Array.isArray(data.features)){
//                     return;
//                 }
    
//                 for(const articleFeature of data.articleFeatures){
//                     const value = articleFeature.value;
//                     let name = '';
                    
//                     for(const feature of data.features){
//                         if(feature.featureId === articleFeature.featureId){
//                             name = feature.name;
//                             break;
//                         }
//                     }
    
//                     features.push({name, value});
//                 }
//                 setFeatureData(features);
//             })
//             .catch((error) => {
//                 console.error('Error in getArticleData:', error);
//                 setMessage('Error');
//             })
//     };
        

//     useEffect(() => {
//         setQuantity(1)
//         getArticleData();
//     }, [id]);


    
    
//     const similarArticle = async () => {
//         try {
//             setLoading(true);
//             if(category && category.categoryId){
//                 const categoryId = category.categoryId;
//                 if(typeof categoryId === 'number' && categoryId > 0){
//                     await api('/api/article/search/', 'post', {
//                         categoryId: category?.categoryId,
//                         keywords: '',
//                         priceMin: 0.1,
//                         priceMax: Number.MAX_SAFE_INTEGER,
//                         features: []
//                     })
//                     .then((res: ApiResponse | undefined) => {
//                         if(res?.status === 'error'){
//                             return setMessage('Try to refresh page!');
//                         }
//                         const fetchArticles: ArticleType[] = res?.data.map((article: ApiArticleDto) => {
//                             const status = selectStatus.includes(article?.status as any) ? article?.status as 'available' | 'visible' | 'hidden' : undefined;
//                             const object:ArticleType = {
//                                 articleId: article?.articleId,
//                                 name: article?.name,
//                                 status: status,
//                                 excerpt: article?.excerpt,
//                                 description: article?.description,
//                                 imageUrl: '',
//                                 price: 0,
//                             };
    
//                             if(article?.photos !== undefined && article?.photos.length > 0){
//                                 object.imageUrl = article?.photos[article?.photos.length-1].imagePath;
//                             }
//                             if(article?.articlePrices !== undefined && article?.articlePrices.length > 0){
//                                 object.price = article?.articlePrices[
//                                     article?.articlePrices.length-1].price;
//                             }
//                             return object;
//                         }).slice(0,7);
//                         setArticles(fetchArticles);
//                     });
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching similar articles:', error);
//             setMessage('Error fetching data. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (category) {
//             similarArticle();
//         }
//     }, [category]);

//     const selectStatus:('available' | 'visible' | 'hidden')[] = ['available', 'visible', 'hidden'];
    
    

//     const showSimilarArticles = () => {
//                 if (!articles || articles?.length === 0) {
//                     return <div>Nema artikala</div>;
//                 }
//                 // const handleClick = (articleId:number | undefined)=>{
//                 //     navigate(`/article/${articleId}`)
//                 //     window.scroll({top: 0, behavior: 'smooth'})
//                 // }
        
//                 const responsiv = {
//                     desktop: {
//                         breakpoint: { max: 3000, min: 1432 },
//                         items: 5,
//                         },
//                     tablet: {
//                         breakpoint: { max: 1432, min: 664 },
//                         items: 5,
//                         },
//                     mobile: {
//                         breakpoint: { max: 664, min: 0 },
//                         items: 2,
//                         },
//                 }
            
//                 return (
//                     <Container >
//                         <h3 id='slicniProizvodi' className='text-center mt-3 slicniProizvodi'>Slicni proizvodi</h3>
                        
//                             <Carousell
//                                 responsive={responsiv}
//                                 autoPlay={true}
//                                 autoPlaySpeed={5000}
//                                 infinite={true}
//                                 pauseOnHover={true}
//                             >
//                                 {articles?.map((article, index) => (
//                                 <Col className='mb-3 d-flex justify-content-center' key={index} >
//                                     <ProductCard article={article}/>
//                                 </Col>
//                             ))}
//                             </Carousell>
//                     </Container>
//                 );
//     };

//     const similarAndDescriptionBtn = () =>{
//         const scrollToSimilar = document.getElementById('slicniProizvodi')
//         scrollToSimilar?.scrollIntoView({behavior: 'smooth'})
//     }
        
//     const description = () =>{
//         const scrollToFeature = document.getElementById('opisProizvoda')
//         scrollToFeature?.scrollIntoView({behavior:'smooth'})
//     }

//     const showFeatureArticleButtons = () =>{

//                 return(
//                     <Container className='w-100 d-flex wrapperFeature'>
//                         <Row className='rowButtons'>
//                             <Col className='p-0 m-0 buttons'>
//                                 <button type="button" onClick={description} className='buttonOpis'>Opis proizvoda</button>
//                                 <button type="button" onClick={similarAndDescriptionBtn} className='buttonOpis'>Slični proizvodi</button>
//                             </Col>
//                         </Row>
//                     </Container>
//                 )
//             }

//     const showFeature = () =>{
//                 return(
//                     <Container className='border p-4' id='opisProizvoda'>
//                         <CardTitle className='mb-3 titleFeature'>
//                             {articleState.article?.name}
//                         </CardTitle>
//                         <CardBody className='titleFeature w-50'>
//                             {articleState.article?.excerpt}
//                         </CardBody>
//                     </Container>
//                 )
//     }

//     const decrementQuantity = () =>{
//         if(quantity > 1){
//             setQuantity(prevQuantity => prevQuantity -1 )
//         }
//     }
        
//     const incrementQuantity = () =>{
//         setQuantity(prevQuantity => prevQuantity + 1 )
//     }
        
//     const addToCart = () =>{
//         const data = {
//             articleId: articleState.article?.articleId,
//             quantity: quantity
//         }
        
//         api('/api/user/cart/addToCart/','post',data)
//             .then((res: ApiResponse | undefined)=>{
//                 if(res?.status === 'error'){
//                     return;
//                 }

//                 window.dispatchEvent(new CustomEvent('cart.update'))
//             })
        
//     }
//     useEffect(() => {
//         setQuantity(1);
//     }, [id]);

//     const showStatus = () =>{
//                 if(articleState.article?.status === 'available'){
//                     return(
//                         <div><FontAwesomeIcon icon={faCheck}/> Na stanju</div>
//                     )
//                 }else if(articleState.article?.status === 'visible'){
//                     return(
//                         <div> <FontAwesomeIcon icon={faXmark}/> Proizvod nije na stanju</div>
//                     )
//                 }
//     }

//     const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

//     const handlePrevPhoto = () => {
//         setCurrentPhotoIndex((prevIndex) => {
//             const newIndex = prevIndex === 0 ? (articleState.article?.photos?.length || 1) - 1 : prevIndex - 1;
//             return newIndex;
//         });
//     };

//     const handleNextPhoto = () => {
//         setCurrentPhotoIndex((prevIndex) =>{
//             const newIndex = prevIndex === (articleState.article?.photos?.length || 1) - 1 ? 0 : prevIndex + 1;
//             return newIndex;
//         }   
//         );
//     };

//     const handlePhotoClick = (index:any) => {
//         setCurrentPhotoIndex(index);
//     };

//     if (!articleState.article) {
//         return null; // Ili možeš prikazati neku poruku ili placeholder
//     }
//     const responsiv = {
//         desktop: {
//             breakpoint: { max: 3000, min: 1432 },
//             items: 3,
//             },
//         tablet: {
//             breakpoint: { max: 1432, min: 664 },
//             items: 3,
//             },
//         mobile: {
//             breakpoint: { max: 664, min: 0 },
//             items: 3,
//             },
//     }

//     const loadData = () =>{
//         return <Spinner animation="border"/>
//     }

     

//     return (
//         <>
//         <RoledMainMenu role='user'/>
//         <Container className='mt-3'>
//             <Row className=''>
//                 <CardTitle className=' articleName'>
//                         <h2 className=''>{articleState.article?.name}</h2>
//                     </CardTitle>
//                     <Col md='6' lg='6' className="border border-1 justify-content-center img pt-3 pb-3">
//             <Row>
//             <Container className="d-flex justify-content-center align-items-center" style={{ height: '' }}>
//                 <Button type="button" className="btnLeftRight" onClick={handlePrevPhoto}>
//                     <FontAwesomeIcon className="icn" icon={faLeftLong} />
//                 </Button>
//                 {/* proveriti article */}
//                 {
//                     articleState.article &&
//                     articleState.article.photos &&
//                     articleState.article.photos[currentPhotoIndex] && (
//                     <img
//                         alt={'Image-' + articleState.article?.photos[currentPhotoIndex].photoId}
//                         src={ApiConfig.PHOTO_PATH + 'small/' + articleState.article?.photos[currentPhotoIndex].imagePath}
//                         style={{ width: '50%', maxWidth: '', margin: '' }}
//                     />
//                     )
//                 }
//                 <Button type="button" className="btnLeftRight" onClick={handleNextPhoto}>
//                     <FontAwesomeIcon className="icn" icon={faRightLong} />
//                 </Button>
//             </Container>
//             </Row>
//             <Row>
//                 {/* {articleState.article.photos.map((photo, index) => (
//                     <Col md='4' className="d-flex justify-content-center mt-3 border p-2"  key={photo.photoId}>
//                         <img
//                             className="w-75 smallImg"
//                             alt={'Image-' + photo.photoId}
//                             src={ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath}
//                             onClick={() => handlePhotoClick(index)}
//                         />
//                     </Col>
//                 ))} */}

//                 <Carousell
//                     responsive={responsiv}
//                     infinite={true}
//                     pauseOnHover={true}
//                 >
//                     {articleState.article.photos?.map((photo, index) => (
//                     <Col className='mt-2 d-flex justify-content-center smallImg' key={index} >
//                         <img 
//                             src={ApiConfig.PHOTO_PATH + 'thumb/' + photo.imagePath} 
//                             alt="" 
//                             style={{ width: '50%', maxWidth: '', margin: '' }}
//                             onClick={()=> handlePhotoClick(index)}/>
                            
//                     </Col>
//                 ))}
//                 </Carousell>
//             </Row>
//         </Col>
//                 {/* <Col md='6' lg='6' className='border border-1 justify-content-center d-flex img pt-3 pb-3'>
//                     <img src={ApiConfig.PHOTO_PATH + 'medium/' + articleState.article?.imageUrl} alt={articleState.article?.name}/>
//                 </Col> */}
//                 <Col md='6' lg='6' className='border border-1 p-0 kolona'>
//                     <CardTitle className='text-center p-3 mb-3 articleNameMobile'>
//                         <h2>{articleState.article?.name}</h2>
//                     </CardTitle>
//                     <div className='status p-3'>
//                         {showStatus()}
//                     </div>
//                     <div className='w-100 d-flex wrapper'>
//                         <div className='w-100 text-center cenaDiv align-items-center d-flex justify-content-center'>
//                             {articleState.article?.articlePrices[articleState.article?.articlePrices.length-1].price} EUR
//                         </div>

//                         <div className='w-100 p-3 d-flex flex-column justify-content-center align-items-center'>
//                             <div className='d-flex kolicina border justify-content-center align-items-center mb-1'>
//                                 <div className='w-100 d-flex justify-content-center'>
//                                     <button type="button" disabled={articleState.article?.status === 'visible'} onClick={decrementQuantity} className='w-100 border'>-</button>
//                                 </div>
//                                 <div className='w-100 d-flex justify-content-center text-center align-items-center'>
//                                     <p className='p-0 m-0'>{quantity}</p>
//                                 </div>
//                                 <div className='w-100 d-flex justify-content-center'>
//                                     <button type="button" disabled={articleState.article?.status === 'visible'} onClick={incrementQuantity} className='w-100 border'>+</button>
//                                 </div>
//                             </div>
//                             <div className='kupiBtn justify-content-center d-flex'>
//                                 <button type="button" onClick={addToCart}
//                                         disabled={articleState.article?.status === 'visible'}
//                                         className='btn btn-success buttonKupi'>
//                                     <FontAwesomeIcon icon={faCartShopping}/> Kupi
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
                    
//                 </Col>
//             </Row>
//             <Row>
//                 {showFeatureArticleButtons()}
//             </Row>
//             <Row>
//                 {showFeature()}
//             </Row>
//             <Row className='border'>   
//                 {showSimilarArticles()}
//             </Row>
//         </Container>
//         </>
//     )
// }











import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleType } from '../../types/ArticleType';
import { Container, Row, Col, CardTitle, CardBody, Button} from 'react-bootstrap';
import { ApiConfig } from '../../config/api.config';
import api, { ApiResponse } from '../../api/api';
import './ArticlePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCheck, faLeftLong, faRightLong, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CategoryType } from '../../types/CategoryType';
import { ProductCard } from '../ProductCard/ProductCard';
import Carousell from "react-multi-carousel";
import { RoledMainMenu } from '../RoledMainMenu/RoledMainMenu';

interface ArticlePageState{
    isUserLoggedIn: boolean;
    articleId: number,
    name: string,
    excerpt: string,
    status?: "available" | "visible" | "hidden",
    description: string,
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
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const navigate = useNavigate()

    const setMessage = (message: string)=>{
        setArticle(prevState =>({
            ...prevState,
            message: message
        }))
    }

    const setLogginState = (isLoggedIn: boolean) =>{
        setArticle(prevState =>({
            ...prevState,
            isUserLoggedIn: isLoggedIn
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
        const responsiv = {
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
        setQuantity(1);
    },[id])

    const getArticle = async ()=>{
        try{
        await api(`api/article/${id}`,'get',{})
            .then((res:ApiResponse | undefined)=>{
                if(res?.data === 'login'){
                    return setLogginState(false);
                }
                if(res?.status === 'error'){
                    return setMessage('Request error. Please try to refresh page!')
                }
                const data = res?.data
                if(data){
                    const fetchArticle:ArticleType = {
                        articleId: data.articleId,
                        description: data.description,
                        excerpt: data.excerpt,
                        name: data.name,
                        status: data.status,
                        price: 0,
                        photos: data.photos || []
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

    const selectStatus:('available' | 'visible' | 'hidden')[] = ['available', 'visible', 'hidden'];
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
                                    res?.data.map((article: ArticlePageState)=>{
                                        const status = selectStatus.includes(article.status as any) ? article.status as 'available' | 'visible' | 'hidden' : undefined;
                                        const object:ArticleType = {
                                            articleId: article.articleId,
                                            name: article.name,
                                            status: status,
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

                                const filterArticle = fetchArticles.filter(article => article.articleId !== Number(id))
                                
                                setArticles(filterArticle)
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
                <div className='visible'> <FontAwesomeIcon icon={faXmark}/> Proizvod nije na stanju</div>
            )
        }
    }
    

    const handlePhotoClick = (index:any) =>{
        setCurrentPhotoIndex(index)
    } 

        const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => {
            const newIndex = prevIndex === 0 ? (article?.photos?.length || 1) - 1 : prevIndex - 1;
            return newIndex;
        });
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>{
            const newIndex = prevIndex === (article?.photos?.length || 1) - 1 ? 0 : prevIndex + 1;
            return newIndex;
        }   
        );
    };
    

    return (
        <>
        <RoledMainMenu role='user'/>
        <Container className='mt-3'>
            <Row className=''>
                <CardTitle className=' articleName'>
                        <h2 className=''>{article?.name}</h2>
                    </CardTitle>
                <Col md='6' lg='6' className='border border-1 justify-content-center flex-column d-flex img pt-3 pb-3'>
                    <Row>
                        <Col className='d-flex justify-content-center align-items-center'>
                        <Button type="button" className="btnLeftRight" onClick={handlePrevPhoto}>
                            <FontAwesomeIcon className="icn" icon={faLeftLong} />
                        </Button>
                        { article && article?.photos && article.photos?.length > 0 && currentPhotoIndex < article.photos.length && (
                            <img src={ApiConfig.PHOTO_PATH + 'medium/' + article?.photos[currentPhotoIndex].imagePath}
                                 alt={'Image -'+article?.name} />
                        )}
                        <Button type="button" className="btnLeftRight" onClick={handleNextPhoto}>
                            <FontAwesomeIcon className="icn" icon={faRightLong} />
                        </Button>
                        </Col>
                    </Row>
                    <Row className='subPhoto border mt-2'>
                        {article?.photos?.map((photo, index)=> (
                            <Col key={index} className='d-flex justify-content-center p-1'>
                                <img src={ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath} alt={'Image -'+article?.name}
                                onClick={() => handlePhotoClick(index)} />
                            </Col>
                        ))}
                    </Row>
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
                                    <button disabled={article?.status === 'visible'} onClick={decrementQuantity} className='w-100 border'>-</button>
                                </div>
                                <div className='w-100 d-flex justify-content-center text-center align-items-center'>
                                    <p className='p-0 m-0'>{quantity}</p>
                                </div>
                                <div className='w-100 d-flex justify-content-center'>
                                    <button disabled={article?.status === 'visible'} onClick={incrementQuantity} className='w-100 border'>+</button>
                                </div>
                            </div>
                            <div className='kupiBtn justify-content-center d-flex'>
                                <button onClick={addToCart}
                                        disabled={article?.status === 'visible'}
                                        className='btn btn-success buttonKupi'>
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
        </>
    )

}
import './Header.css';
import logo from '../../Images/logo/IvaPharmLogo.jpg';
import location from '../../Images/pin.png';
import user from '../../Images/user.png';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Cart } from '../Cart/Cart';
import { useEffect, useState } from 'react';
import api, { ApiResponse, getRole, Role } from '../../api/api';
import { ArticleType } from '../../types/ArticleType';
import { ApiConfig } from '../../config/api.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

interface HeaderSearch {
    isUserLoggedIn: boolean;
    articles: ArticleType[];
    filters: {
        keywords: string;
    }
}

const Header= () =>{
    const locationn = useLocation()
    const role: Role = getRole();
    const [quantity, setQuantity] = useState(1);
    const [header, setHeaderState] = useState<HeaderSearch>({
        articles: [],
        isUserLoggedIn: true,
        filters: {
            keywords: ''
        }
    });
    const[isLoggedIn, setLogin] = useState<boolean>(false);
    const[debouncedKeywords, setDebouncedKeywords] = useState(header.filters.keywords)

    useEffect(()=>{
        const token = localStorage.getItem('api_token_user');
        setLogin(!!token);
    })

    const setLogginState = (isLoggedIn: boolean) =>{
        setHeaderState(prevState =>({
            ...prevState,
            isUserLoggedIn: isLoggedIn
        }))
    }

    useEffect(() =>{
        const hendler = setTimeout(()=>{
            setDebouncedKeywords(header.filters.keywords);
        },300)

        return() =>{
            clearTimeout(hendler)
        }
    },[header.filters.keywords])

    useEffect(() =>{
        if(debouncedKeywords.trim().length > 0){
            getArticlesWithFilter()
        }else{
            setHeaderState(prevState =>({
                ...prevState,
                articles: []
            }))
        }
    },[debouncedKeywords])


    const filterSearchChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setHeaderState({
            ...header,
            filters:{
                ...header.filters,
                keywords: event.target.value
            }
        })
    }

    const getArticlesWithFilter = () =>{
        api('/api/article/search-by-name/','post',{
            keywords: header.filters.keywords
        },undefined, role)
            .then((res: ApiResponse)=>{
                if(res.status === 'login'){
                    return setLogginState(false)
                }
                if(res.status === 'error'){
                    return 'Error';
                }

                setHeaderState({...header, articles: res.data })
                
            })
        
    }

    const navigate = useNavigate();

    const handleClick = (articleId: number | undefined) =>{
        navigate('/article/'+articleId)

        setHeaderState(prevState =>({
            ...prevState,
            articles: []
        }))
    }


    const goToHome = () =>{
        navigate('/')
    }

    const shouldRenderHeader = !locationn.pathname.startsWith('/administrator/login') &&
                               !locationn.pathname.startsWith('/administrator/dashboard') &&
                               !locationn.pathname.startsWith('/administrator/logout')

        return (
        <>
            <div className='container-fluid mb-2'>
                {shouldRenderHeader && (
                    <>
                    <div className="container-fluid header">
                        <div onClick={goToHome} className="logo">
                            <img src={logo} alt="" className='logoImg' />
                        </div>
                        
                            <div className="search">
                                <Form className='d-flex w-100 formSearch'>
                                    <Form.Control
                                        type='search'
                                        placeholder='Pretraži po nazivu...'
                                        className='me-2 searchControl'
                                        aria-label='Search'
                                        value={header.filters.keywords}
                                        onChange={filterSearchChange}
                                    />
                                    {header.articles && header.articles.length > 0 && (
                                        <div className="searchArticle">
                                            {header.articles.slice(0, 8).map(article => (
                                                <ul key={article.articleId}>
                                                    {article.photos && article.photos.length > 0 && (
                                                        <img onClick={() => handleClick(article.articleId)} className='imgSearch p-0' src={ApiConfig.PHOTO_PATH + '/thumb/' + article.photos[0].imagePath} alt={article.name}
                                                            style={{ width: '50px', height: '50px', margin: '5px' }} />
                                                    )}
                                                    <div className='d-flex flex-column'>
                                                        <div>
                                                            <li onClick={() => handleClick(article.articleId)} className='p-2 articleNameCursor priceAndNameArticle'>{article.name}</li>
                                                        </div>
                                                        <div className='d-flex'>
                                                            {article.articlePrices && article.articlePrices.length > 0 && (
                                                                <li className='d-flex p-1 priceAndNameArticle'>{article.articlePrices[article.articlePrices.length - 1].price} €</li>
                                                            )}
                                                        </div>
                                                    </div>
                                                </ul>
                                            ))}
                                        </div>
                                    )}
                                </Form>
                            </div>
                        

                        <div className="login">
                            <div className="location">
                                <img src={location} alt="Location" className='imgLocation' />
                                <div className="locationP">
                                    <p>Lokacije</p>
                                </div>
                            </div>
                            {isLoggedIn ? (
                                <Link to={"/user/profile"} className='user'>
                                    <img src={user} alt="User" className='imgUser' />
                                    <div className="userP">
                                        <p>Moj profil</p>
                                    </div>
                                </Link>
                            ) : (
                                <Link to={"/user/login"} className='user'>
                                    <img src={user} alt="User" className='imgUser' />
                                    <div className="userP">
                                        <p>Prijava</p>
                                    </div>
                                </Link>
                            )}
                            <div className="cart">
                                <Cart />
                                <div className="korpaP">
                                    <p>Korpa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="search-mobile">
                        <Form className='d-flex mt-1'>
                            <Form.Control
                                type='search'
                                placeholder='Pretraga...'
                                className='me-2'
                                aria-label='Search'
                            />
                            <Button variant='outline-success '>Pretraži</Button>
                        </Form>
                    </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Header;
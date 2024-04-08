import { Link, useNavigate } from 'react-router-dom';
import { CategoryType } from '../../types/CategoryType';
import './HomePage.css'
import { useEffect, useState } from 'react';
import api, { ApiResponse } from '../../api/api';
import { Card, CardTitle } from 'react-bootstrap';
import 'react-multi-carousel/lib/styles.css';
import banerPopust from './Image/BanerPopustPenzioneriDesktop.jpg'
import Carousel from 'react-bootstrap/Carousel';
import Carousell from "react-multi-carousel";
import { ApiConfig } from '../../config/api.config';

interface HomePageState{
    isUserLoggedIn: boolean;
    categories: CategoryType[];
}

interface ApiCategoryDto{
    categoryId: number;
    name: string;
    imagePath: string;
}

export const HomePage = () =>{
    const navigate = useNavigate();

    const[homePageState, setHomePageState] = useState<HomePageState>({
        isUserLoggedIn: true,
        categories: [],
    })

    // if(homePageState.isUserLoggedIn === false){
    //     navigate('/user/login')
    //     return null;
    // }

    useEffect(()=>{
        if(homePageState.isUserLoggedIn === false){
            navigate('/user/login');
        }else if(homePageState.categories.length === 0){ // Provera da li su kategorije vec ucitane
            getCategories();
        }
    },[homePageState.isUserLoggedIn, homePageState.categories.length])

    const getCategories = () =>{
        api('api/category/?filter=parentCategoryId||$isnull','get',{})
            .then((res: ApiResponse | undefined) =>{
                if(res?.status === 'error' || res?.status === 'login' || !Array.isArray(res?.data)){
                    setLogginState(false);
                    return;
                }
                putCategoriesInState(res?.data as ApiCategoryDto[])
            })
    }

    const putCategoriesInState = (data: ApiCategoryDto[]) =>{
        console.log(data)
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

    const singleCategory = (category: CategoryType) =>{
        return(
            <div className='divBody'>
                <CardTitle className='mb-2'>
                        {category.name}
                </CardTitle>
                <Link to={`/category/${category.categoryId}`} className=''>
                    <img className='' src={ApiConfig.PHOTO_PATH+'category/'+category.imagePath}></img>
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
            items: 3,
            },
        mobile: {
            breakpoint: { max: 664, min: 0 },
            items: 2,
            },
    }

    const baneri =[
        {name: 'stavka 1', id: 1},
    ];

    return(
        <div className="HomePage">
            <div className='baneri mt-3'>
            <Carousel className='carousel'>
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

            <Card.Title className='text-center m-4'>
                <p>KATEGORIJE</p>
            </Card.Title>

            <div className="kategorije mb-4">
                <Carousell
                    responsive={responsive}
                    autoPlay= {true}
                    autoPlaySpeed={4000}
                    infinite= {true}
                    arrows={true}
                >
                    {homePageState.categories.map(category => singleCategory(category))}
                </Carousell>
            </div>
        </div>
    )
}
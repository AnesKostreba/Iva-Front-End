import { Link, useNavigate } from 'react-router-dom';
import { CategoryType } from '../../types/CategoryType';
import './HomePage.css'
import { useEffect, useState } from 'react';
import api, { ApiResponse } from '../../api/api';
import { Card, Col, Container, Row } from 'react-bootstrap';

interface HomePageState{
    isUserLoggedIn: boolean;
    categories: CategoryType[];
}

interface ApiCategoryDto{
    categoryId: number;
    name: string;
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
        if(!homePageState.isUserLoggedIn){
            navigate('/user/login');
        }else if(homePageState.categories.length === 0){ // Provera da li su kategorije vec ucitane
            getCategories();
        }
    },[homePageState.isUserLoggedIn, homePageState.categories.length])

    const getCategories = () =>{
        api('api/category/','get',{})
            .then((res: ApiResponse | undefined) =>{
                if(res?.status === 'error' || res?.status === 'login' || !Array.isArray(res?.data)){
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
                items:      []
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
            <Col md='3'>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            {category.name}
                        </Card.Title>
                        <Link to={`/category/${category.categoryId}`} className='btn btn-primary'>
                            Open category
                        </Link>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    return(
        <div className="HomePage">
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <p>Top level categories</p>
                        </Card.Title>
                    </Card.Body>
                    <Row>
                        {homePageState.categories.map(category => singleCategory(category))}
                    </Row>
                </Card>
            </Container>
        </div>
    )
}
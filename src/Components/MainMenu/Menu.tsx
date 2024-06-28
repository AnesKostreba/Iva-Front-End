import { useEffect, useState } from 'react';
import './Menu.css';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown} from '@fortawesome/free-solid-svg-icons';
import { CategoryType } from '../../types/CategoryType';
import api, { ApiResponse } from '../../api/api';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';


export interface MainMenuItem{
    text: string;
    link: string
}
export interface MainMenuProperties{
    items: MainMenuItem[];
}
interface CategoryState{
    subcategories?: CategoryType[];
    isUserLoggedIn: boolean;
    category: CategoryType[];
}
interface CategoryDto{
    categoryId: number;
    name: string;
}

export const Menu: React.FC<MainMenuProperties> = () =>{

    const[category, setCategoryState] = useState<CategoryState>({
        isUserLoggedIn: true,
        category: []
    })

    const [isSubMenuVisible, setIsSubMenuVisible] = useState<number | null>(null);
    const[hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);
    const[isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        const categoryId = Number(event.currentTarget.getAttribute('data-category-id'))
        setIsHovered(true)
        setHoveredCategoryId(categoryId)
        getSubcategories(categoryId)
        setIsSubMenuVisible(categoryId)
    };

    const handleSubcategoryMouseEnter = (event: React.MouseEvent<HTMLElement>) =>{
        const categoryId = Number(event.currentTarget.getAttribute('data-sub-category-id'))
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setHoveredCategoryId(null);
    };

    const setSubcategories = (subcategories: CategoryType[]) =>{
        setCategoryState(prevState =>({
            ...prevState,
            subcategories: subcategories
        }))
    }

    const setLogginState = (isLoggedIn: boolean) =>{
        setCategoryState(prevState =>({
            ...prevState,
            isUserLoggedIn: isLoggedIn
        }))
    }

    const setMessage = (message: string) =>{
        setCategoryState(prevState=>({
            ...prevState,
            message: message
        }))
    }

    const putCategoriesInState = (data: ApiCategoryDto[]) =>{
        if(data && data.length > 0 ){
            const categories: CategoryType[] = data?.map(category => {
                return{
                    categoryId: category.categoryId,
                    imagePath : category.imagePath,
                    name      : category.name,
                    items     : [],
                    subcategories: []
                }
            })

            setCategoryState(prevState =>({
                ...prevState,
                category: categories
            }))

            data.forEach(category=>{
                getSubcategories(category.categoryId)
            })
        }
    }


    const getCategories = () =>{
        api('api/category/?filter=parentCategoryId||$isnull','get',{},'user')
            .then((res: ApiResponse)=>{
            if(res?.status === 'login'){
            return setLogginState(false)
            }
            if(res?.status === 'error'){
                return setMessage('Request error. Please try to refresh page.')
            }
            putCategoriesInState(res.data as ApiCategoryDto[])
            })

    }

    const getSubcategories = (parentId: number) =>{
        api(`api/category/${parentId}`,'get',{},'user')
            .then((res: ApiResponse)=>{
                if(res?.status === 'login'){
                    return setLogginState(false)
                }
                if(res?.status === 'error'){
                    return setMessage('Request error. Please try to refresh page.')
                }

                if(res.data && res.data.categories){
                    const subcategories:CategoryType[] =
                            res.data.categories.map((category:CategoryDto)=>{
                                return{
                                    categoryId: category.categoryId,
                                    name      : category.name,
                                    subcategories: []
                                }
                            });
                   
                    setSubcategories(subcategories)

                    setCategoryState(prevState => {
                        const updatedCategories = prevState.category.map(cat => {
                            if (cat.categoryId === parentId) {
                                return { ...cat, subcategories };
                            }
                            return cat;
                        });

                        return { ...prevState, category: updatedCategories };
                    });
                }
            })
    }

    useEffect(()=>{
        if(category.category.length === 0){
            getCategories()
        }
        
    },[hoveredCategoryId])


    const handleClick = (categoryId: number | undefined) =>{
        if(categoryId !== undefined){
            navigate(`/category/${categoryId}`)
        }
        setIsHovered(false)
    }

    return(
        <Navbar className='navbar'>
            <Nav className='nav'>
                <ul>
                    <li className='allCategories'
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >Sve kategorije
                    <FontAwesomeIcon className='iconDown' icon={faAngleDown}/>
                    </li>{
                        isHovered && (
                            <ul 
                                className='dropdown'
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                >
                                {category.category.map(cat =>(
                                    <li
                                        key={cat.categoryId}
                                        className='drop-item'
                                        data-category-id={cat.categoryId}
                                        onClick={() =>handleClick(cat.categoryId)}
                                        onMouseEnter={handleMouseEnter}
                                    >{cat.name}
                                    {
                                        cat.subcategories && cat.subcategories?.length > 0 && (
                                            <FontAwesomeIcon className='downSubcat' icon={faAngleDown}/>
                                        )
                                        
                                    }
                                    {isSubMenuVisible === cat.categoryId && (
                                        <ul className='subMenu'
                                            onMouseEnter={handleSubcategoryMouseEnter}
                                        >
                                            {category.subcategories?.map(subcat =>(
                                                <li 
                                                    className='sub-item'
                                                    data-sub-category-id={subcat.categoryId}
                                                    onMouseEnter={handleSubcategoryMouseEnter}
                                                    onClick={(e) => {
                                                        e.stopPropagation();    
                                                        handleClick(subcat.categoryId)}}
                                                    key={subcat.categoryId}>
                                                    {subcat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                </ul>
            </Nav>
        </Navbar>

        // <div></div>
        // <Navbar className='' >
        //         <Nav className="me-auto">
        //             <ul className='ulMenu'>
        //                 <li className='sveKategorije'>Sve kategorije</li>
        //             </ul>
                    /* {state.map((item,index) =>(
                        <Nav.Link key={index} as={Link} to={item.link}>
                            
                            {item.text}
                        </Nav.Link>
                    ))} */
        //         </Nav>
        // </Navbar>
    )
}
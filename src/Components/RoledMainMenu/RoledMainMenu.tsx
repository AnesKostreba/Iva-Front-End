import { useEffect, useState } from "react";
import { MainMenuItem, Menu } from "../MainMenu/Menu";
import { CategoryType } from "../../types/CategoryType";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ApiCategoryDto from "../../dtos/ApiCategoryDto";
import api, { ApiResponse, getRole, Role } from "../../api/api";
import { Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import './RoledMainMenu.css'

interface RoledMainMenuProperties{
    role: 'user' | 'administrator' | 'visitor';
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

export const RoledMainMenu :React.FC<RoledMainMenuProperties> = ({role}) =>{
    const location = useLocation()
    const roles: Role = getRole();
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
        api('api/category/?filter=parentCategoryId||$isnull','get',{},undefined,roles)
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
        api(`api/category/${parentId}`,'get',{},undefined,roles)
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
        if(location.pathname.startsWith('/administrator/')){
            return;
        }
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




    const getUserMenuItems = ():MainMenuItem[] =>{
        return [
            
            {text: 'O nama', link: '/about-us'},
            {text: 'Pitaj farmaceuta', link: '/question'},
            {text: 'Blog', link: '/blog'},
            {text: 'Poslovnice', link: '/branches'},
            {text: 'Zaposlenje', link: '/employment'},
            {text: 'Kontakt', link: '/contact'},
        ];
    }

    const getAdminMenuItems = ():MainMenuItem[] =>{
        return [
            {text: 'Kontrolna tabla', link: '/administrator/dashboard'},
            {text: 'Administrator Login', link: '/administrator/login/'},
            {text: 'Izloguj se', link: '/administrator/logout'},
        ];
    }

    const getVisitorMenuItems = ():MainMenuItem[] =>{
        return [

        ];
    }

    let items: MainMenuItem[] = [];

    switch(role){
        case 'user':
            items = getUserMenuItems();
            break;
        case 'administrator':
            items = getAdminMenuItems();
            break;
        case 'visitor':
            items = getVisitorMenuItems();
            break;
        default:
            items = [];
            break;
    }

    if (role === 'user') {
        items.unshift({ text: 'Sve kategorije', link: '#' });
      }


    return(
        <>
        <Navbar className='navbar text-white'>
            <Nav className='me-auto navbarWrapper'>
                {items.map((item, index) => (
                <Nav.Link 
                    
                    className={` class-comon ${item.text === 'Sve kategorije' ? 'allCategories' : ''}`} 
                    key={index} as={Link} to={item.link} 
                    onMouseEnter={item.text === 'Sve kategorije' ? handleMouseEnter : undefined} 
                    onMouseLeave={item.text === 'Sve kategorije' ? handleMouseLeave : undefined}
                    style={item.text === 'Sve kategorije' ? {position:'relative'} : {} }>
                    {item.text}
                    {item.text === 'Sve kategorije' && (
                        <FontAwesomeIcon className='iconDown' icon={faAngleDown} />
                    )}
                    
                </Nav.Link>
                ))}

{isHovered && role === 'user' && (
            <ul className='dropdown' 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}>
            {category.category.map(cat => (
                <li
                key={cat.categoryId}
                className='drop-item'
                data-category-id={cat.categoryId}
                onClick={() => handleClick(cat.categoryId)}
                onMouseEnter={handleMouseEnter}
                >
                {cat.name}
                {cat.subcategories && cat.subcategories.length > 0 && (
                    <FontAwesomeIcon className='downSubcat' icon={faAngleDown} />
                )}
                {isSubMenuVisible === cat.categoryId && (
                    <ul className='subMenu' onMouseEnter={handleSubcategoryMouseEnter}>
                    {category.subcategories?.map(subcat => (
                        <li
                        className='sub-item'
                        data-sub-category-id={subcat.categoryId}
                        onMouseEnter={handleSubcategoryMouseEnter}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick(subcat.categoryId)
                        }}
                        key={subcat.categoryId}
                        >
                        {subcat.name}
                        </li>
                    ))}
                    </ul>
                )}
                </li>
            ))}
            </ul>
        )}

            </Nav>
        </Navbar>
        
    </>
    )
}
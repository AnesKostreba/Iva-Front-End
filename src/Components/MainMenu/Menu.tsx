import { useEffect, useState } from 'react';
import './Menu.css';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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

export const Menu: React.FC<MainMenuProperties> = ({items}) =>{

    
    const[state, setState] = useState<MainMenuItem[]>(items)
    

    return(
        // <Navbar className='navbar'>
        //     <Nav className='nav'>
        //         <ul>
        //             <li className='allCategories'
        //                 onMouseEnter={handleMouseEnter}
        //                 onMouseLeave={handleMouseLeave}
        //             >Sve kategorije
        //             <FontAwesomeIcon className='iconDown' icon={faAngleDown}/>
        //             </li>{
        //                 isHovered && (
        //                     <ul 
        //                         className='dropdown'
        //                         onMouseEnter={handleMouseEnter}
        //                         onMouseLeave={handleMouseLeave}
        //                         >
        //                         {category.category.map(cat =>(
        //                             <li
        //                                 key={cat.categoryId}
        //                                 className='drop-item'
        //                                 data-category-id={cat.categoryId}
        //                                 onClick={() =>handleClick(cat.categoryId)}
        //                                 onMouseEnter={handleMouseEnter}
        //                             >{cat.name}
        //                             {
        //                                 cat.subcategories && cat.subcategories?.length > 0 && (
        //                                     <FontAwesomeIcon className='downSubcat' icon={faAngleDown}/>
        //                                 )
                                        
        //                             }
        //                             {isSubMenuVisible === cat.categoryId && (
        //                                 <ul className='subMenu'
        //                                     onMouseEnter={handleSubcategoryMouseEnter}
        //                                 >
        //                                     {category.subcategories?.map(subcat =>(
        //                                         <li 
        //                                             className='sub-item'
        //                                             data-sub-category-id={subcat.categoryId}
        //                                             onMouseEnter={handleSubcategoryMouseEnter}
        //                                             onClick={(e) => {
        //                                                 e.stopPropagation();    
        //                                                 handleClick(subcat.categoryId)}}
        //                                             key={subcat.categoryId}>
        //                                             {subcat.name}
        //                                         </li>
        //                                     ))}
        //                                 </ul>
        //                             )}
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 )
        //             }
        //         </ul>
        //     </Nav>
        // </Navbar>

         <Navbar className=''>
                 <Nav className=" navBarNav">
                     {state.map((item,index) =>(
                        <Nav.Link
                        key={index} as={Link} to={item.link}>
                            {item.text}
                        </Nav.Link>
                    ))} 
                 </Nav>
         </Navbar>
    )
}
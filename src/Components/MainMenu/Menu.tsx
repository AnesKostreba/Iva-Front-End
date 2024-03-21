import { useState } from 'react';
import './Menu.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export interface MainMenuItem{
    text: string;
    link: string
}
export interface MainMenuProperties{
    items: MainMenuItem[];
}

export const Menu: React.FC<MainMenuProperties> = ({items}) =>{
    const [state, setState] = useState(items);
    const setItems = (newItems: MainMenuItem[]) =>{
        setState(newItems)
    }

    return(
        <Navbar className='navbar' data-bs-theme="dark">
            <Container>
                <Nav className="me-auto">
                    {state.map((item,index) =>(
                        <Nav.Link key={index} as={Link} to={item.link}>
                            {item.text}
                        </Nav.Link>
                    ))}
                </Nav>
            </Container>
        </Navbar>
    )
}
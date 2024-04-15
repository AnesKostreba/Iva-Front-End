import { useEffect, useState } from "react";
import CartType from "../../types/CartType";
import api, {ApiResponse} from '../../api/api';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, NavItem, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import './Cart.css'

interface CartState {
    count: number;
    cart?: CartType;
    cartVisible: boolean;
}

export const Cart = () =>{
    const[cart, setCart] = useState<CartState>({
        count: 0,
        cartVisible: false,
    });

    
    
    useEffect(()=>{
        const updateCart = () =>{
            api("/api/user/cart/",'get',{})
            .then((res:ApiResponse | undefined)=>{
                if(res?.status === 'error'){
                    setStateCount(0);
                    setStateCart(undefined);
                    return
                }
                setStateCart(res?.data);
                setStateCount(res?.data.cartArticles.length);
                console.log(res?.data)
            })
            
        }
        updateCart();

        const cartUpdateHandler = () =>{
            updateCart()
        }

        window.addEventListener("cart.update", cartUpdateHandler);
        
        return () =>{
            window.removeEventListener("cart.update", cartUpdateHandler);
        }
    },[cart.count])

    const setStateCount = (newCount: number)=>{
        setCart(prevState=>({
            ...prevState,
            count: newCount
        }))
    }

    const setStateCart = (newCart?: CartType)=>{
        setCart(prevState=>({
            ...prevState,
            cart: newCart
        }))
    }

    const setStateVisible = (newState: boolean)=>{
        setCart(prevState =>({
            ...prevState,
            cartVisible: newState
        }))
    }

    const showCart = () =>{
        setStateVisible(true);
    }

    const hideCart = () =>{
        setStateVisible(false)
    }

    const calculateSum = () =>{
        let sum: number= 0;
        if(!cart.cart){
            return sum;
        }
        for(const item of cart.cart?.cartArticles){
            sum += item.article.articlePrices[item.article.articlePrices.length-1].price * item.quantity;
        }

        return sum;
    }

    const sum = calculateSum();


    return(
        <>
        <NavItem>
            <NavLink className='iconCart' to={''} onClick={(e)=> {e.preventDefault(); showCart()}}>
                <FontAwesomeIcon icon={faCartArrowDown}/>({cart.count})
            </NavLink>
        </NavItem>
        <Modal size="lg" centered show={cart.cartVisible} onHide={()=> hideCart()}>
            <ModalHeader closeButton>
                <ModalTitle>Vaša korpa</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Table hover size="sm">
                    <thead>
                        <tr>
                            <th>Kategorija</th>
                            <th>Artikal</th>
                            <th className="text-right">Količina</th>
                            <th className="text-right">Cijena</th>
                            <th className="text-right">Ukupno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.cart?.cartArticles.map(item=>{
                            const price = Number(item.article.articlePrices[item.article.articlePrices.length-1].price).toFixed(2)
                            const total = Number(item.article.articlePrices[item.article.articlePrices.length-1].price * item.quantity).toFixed(2);

                            return(
                                <tr>
                                    <td>{item.article.category.name}</td>
                                    <td>{item.article.name}</td>
                                    <td className="text-right">{item.quantity}</td>
                                    <td className="text-right">{price} EUR</td>
                                    <td className="text-right">{total} EUR</td>
                                    <td>...</td>
                                </tr>
                            )
                        }, this)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><strong>Ukupno:</strong></td>
                            <td className="text-right">{Number(sum).toFixed(2)} EUR</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </Table>
            </ModalBody>
            <ModalFooter>
                <Button variant="primary" >Kupi</Button>
            </ModalFooter>
        </Modal>
        </>
    )
}
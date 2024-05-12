import { useEffect, useState } from "react";
import CartType from "../../types/CartType";
import api, {ApiResponse} from '../../api/api';
import { Alert, Button, FormControl, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, NavItem, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faCartShopping, faMinusSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import './Cart.css'
import { ApiConfig } from "../../config/api.config";

interface CartState {
    count: number;
    cart?: CartType;
    cartVisible: boolean;
    message: string;
    cartMenuColor: string;
}



export const Cart = () =>{
    const[cart, setCart] = useState<CartState>({
        count: 0,
        cartVisible: false,
        message: '',
        cartMenuColor: '#000000'
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

                const cartArticlesLength = res?.data.cartArticles?.length ?? 0;
                setStateCart(res?.data);
                setStateCount(cartArticlesLength);
                
                setStateMenuColor('#ff0000')
                setTimeout(()=> setStateMenuColor('#000000'),1000)
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

    const setStateMessage = (newMessage:string)=>{
        setCart(prevState =>({
            ...prevState,
            message: newMessage
        }))
    }

    const setStateMenuColor = (newColor:string)=>{
        setCart(prevState =>({
            ...prevState,
            cartMenuColor: newColor
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
        if(!cart.cart || !cart.cart?.cartArticles){
            return sum;
        }

        for(const item of cart.cart.cartArticles){
            sum += item.article.articlePrices[item.article.articlePrices.length-1].price * item.quantity;
        }

        return sum;
    }

    const sum = calculateSum();

    const sendCartUpdate = (data:any) =>{
        api('/api/user/cart/','patch', data)
        .then((res: ApiResponse | undefined) =>{
            if(res?.status === 'error'){
                setStateCount(0);
                setStateCart(undefined);
                return
            }

            setStateCart(res?.data);
            setStateCount(res?.data.cartArticles.length);

            
        })
    }

    const updateQuantity = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const articleId = event.target.dataset.articleId;
        const newQuantity = event.target.value;

        const data = {
            articleId: Number(articleId),
            quantity: Number(newQuantity),
        }

        sendCartUpdate(data);
    }


    const removeFromCart = (articleId: number) =>{
        sendCartUpdate({
            articleId: Number(articleId),
            quantity: 0,
        });
    }


    const makeOrder = () =>{
        api('/api/user/cart/makeOrder/','post',{})
            .then((res:ApiResponse | undefined)=>{
                if(res?.status === 'error'){
                    setStateCount(0);
                    setStateCart(undefined);
                    return
                }

                setStateMessage('Vaša porudžbina je uspešno izvršena!');

                setStateCart(undefined);
                setStateCount(0);
            })
    }

    const setHideCart = () =>{
        setStateMessage('');
        setStateVisible(false)
    }

    return(
        <>
        <NavItem>
            <NavLink className='iconCart d-flex' to={''} onClick={(e)=> {e.preventDefault(); showCart()}}
                style={{color: cart.cartMenuColor}}>
                <FontAwesomeIcon icon={faCartShopping} className="d-flex"/><div className="cartCount">({cart.count})</div>
            </NavLink>
        </NavItem>
        <Modal size="lg" centered show={cart.cartVisible} onHide={()=> setHideCart()}>
            <ModalHeader closeButton className="vasaKorpa">
                <ModalTitle className="">Vaša korpa</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Table hover size="sm">
                    <thead>
                        <tr>
                            <th>Slika artikla</th>
                            <th>Artikal</th>
                            <th className="text-right">Količina</th>
                            <th className="text-right">Cijena</th>
                            <th className="text-right">Ukupno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.cart?.cartArticles && cart.cart?.cartArticles.map(item=>{
                            const image = item.article.photos[item.article.photos.length-1].imagePath;

                            const price = Number(item.article.articlePrices[item.article.articlePrices.length-1].price).toFixed(2)
                            const total = Number(item.article.articlePrices[item.article.articlePrices.length-1].price * item.quantity).toFixed(2);

                            return(
                                <tr>
                                    <td><img src={ApiConfig.PHOTO_PATH + 'thumb/' + image} alt="" /></td>
                                    {/* <td>{item.article.category.name}</td> */}
                                    <td>{item.article.name}</td>
                                    <td className="text-right">
                                        <FormControl type="number" step='1' min='1'
                                                     value={item.quantity}
                                                     data-article-id={item.articleId}
                                                     onChange={(e) => updateQuantity(e as any)}
                                                     />
                                        </td>
                                    <td className="text-right">{price} EUR</td>
                                    <td className="text-right">{total} EUR</td>
                                    <td className="faSquareXmark">
                                        <FontAwesomeIcon className=""
                                                icon={faSquareXmark}             
                                                onClick={() => removeFromCart(
                                                item.article.articleId)}/>
                                    </td>
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
                <Alert variant="success" className={cart.message ? '' : 'd-none'}>{cart.message}</Alert>
            </ModalBody>
            <ModalFooter >
                <button className="kupi" onClick={() => makeOrder()}
                        disabled={cart.cart?.cartArticles && cart.cart?.cartArticles.length === 0 }>Kupi</button>
            </ModalFooter>
        </Modal>
        </>
    )
}
import { useEffect, useState } from "react";
import OrderType from "../../types/OrderType";
import api, { ApiResponse } from "../../api/api";
import { Button, Card, CardBody, CardTitle, Container, FormControl, Modal, ModalBody, ModalHeader, ModalTitle, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faBoxArchive, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { ApiConfig } from "../../config/api.config";
import CartType from "../../types/CartType";
import { ArticleType } from "../../types/ArticleType";

interface OrdersPageState{
    isUserLoggedIn: boolean;
    orders: OrderType[];
    cartVisible: boolean;
    cart?: CartType;
}

interface OrderDto {
    orderId: number;
    createdAt: string;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: {
        cartId: number;
        user: string;
        createdAt: string;
        cartArticles: {
            articleId: number;
            quantity: number;
            article: {
                articleId: number;
                name: string;
                excerpt: string;
                status: "available" | "visible" | "hidden";
                isPromoted: number;
                category: {
                    categoryId: number;
                    name: string;
                },
                articlePrices: {
                    price: number;
                    createdAt: string;
                }[];
                photos: {
                    imagePath: string;
                }[];
            }
        }[]
    }
}

export const OrdersPage = () =>{
    const [orders, setOrders] = useState<OrdersPageState>({
        isUserLoggedIn: true,
        orders: [],
        cartVisible: false
    })

    const setLogginState = (isLoggedIn: boolean) =>{
        setOrders(prevState =>({
            ...prevState,
            isUserLoggedIn: isLoggedIn
        }))
    }

    const setCartVisibleState = (orders: boolean) =>{
        setOrders(prevState =>({
            ...prevState,
            cartVisible: orders
        }))
    }

    const setCartState = (cart: CartType) =>{
        setOrders(prevState =>({
            ...prevState,
            cart: cart
        }))
    }

    const setOrdersState = (orders: OrderType[]) =>{
        setOrders(prevState =>({
            ...prevState,
            orders: orders
        }))
    }

    const hideCart = () =>{
        setCartVisibleState(false);
    }
    const showCart = () =>{
        setCartVisibleState(true);
    }

    const getOrders = () =>{
        api('/api/user/cart/orders', 'get', {})
            .then((res: ApiResponse) =>{
                const data: OrderDto[] = res.data;

                if(data){
                const orders: OrderType[] = data.map(order =>({
                    orderId: order.orderId,
                    status: order.status,
                    createdAt: order.createdAt,
                    cart:{
                        cartId: order.cart.cartId,
                        user: null,
                        userId: 0,
                        createdAt: order.cart.createdAt,
                        cartArticles: order.cart.cartArticles.map(ca=>({
                            carArticleId: 0,
                            articleId: ca.article.articleId,
                            quantity: ca.quantity,
                            article:{
                                articleId: ca.article.articleId,
                                name: ca.article.name,
                                category: {
                                    categoryId: ca.article.category.categoryId,
                                    name: ca.article.name,
                                },
                                photos: ca.article.photos?.map(photo =>({
                                    imagePath: photo.imagePath
                                })),
                                articlePrices: ca.article.articlePrices.map(ap=>({
                                articlePriceId: 0,
                                createdAt: ap.createdAt,
                                price: ap.price,
                            }))
                            } 
                        }))
                    }
                }))
                setOrdersState(orders)
                }
                
            })
    }

    useEffect(()=>{
        getOrders()
    },[])


    const setAndShowCart = (cart: CartType) =>{
        setCartState(cart)
        showCart()
    }

    const printOrderRow = (order: OrderType) =>{
        return(
            <tr>
                <td>{order.createdAt}</td>
                <td>{order.status}</td>
                <td className="text-right">
                    <Button className="p-2" size="sm" variant="outline-success" 
                            onClick={ () => setAndShowCart(order.cart)}>
                            <FontAwesomeIcon icon={faBoxOpen}/> Pregredaj korpu
                    </Button>
                </td>
            </tr>
        )
    }

    const getLatestPriceBeforeDate = (article: any, latestDate: any) =>{
        const cartTimeStamp = new Date(latestDate).getTime();

        let price = article.articlePrices[0]

        for(let ap of article.articlePrices){
            const articlePriceTimestamp = new Date(ap.createdAt).getTime();

            if(articlePriceTimestamp < cartTimeStamp){
                price = ap;
            }else{
                break
            }
        }
        return price;
        
    }

    const calculateSum = () =>{
        let sum: number= 0;
        if(!orders.cart || !orders.cart?.cartArticles){
            return sum;
        }else{

            for(const item of orders.cart.cartArticles){
               
                let price = getLatestPriceBeforeDate(item.article,orders.cart.createdAt)
                
                if(price !== undefined){
                    sum += price.price * item.quantity;
                }
            }
        }

        return sum;
    }


    const sum = calculateSum();

    return (
        <Container className="mt-3">
            <Card>
                <CardBody>
                    <CardTitle className="text-center mojePorudzbine">
                        <FontAwesomeIcon icon={faBoxArchive}/> Moje porudzbine<hr/>
                    </CardTitle>

                    <Table>
                    <thead>
                        <tr>
                            <th>Porudžbina kreirana</th>
                            <th>Status porudžbine</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.orders.map(printOrderRow, this)
                        }
                    </tbody>
                    </Table>
                </CardBody>
            </Card>

            <Modal size="lg" centered show={orders.cartVisible} onHide={()=> hideCart()}>
            <ModalHeader closeButton className="vasaKorpa">
                <ModalTitle className="">Vaše porudžbine</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Table hover size="sm">
                    <thead>
                        <tr>
                            {/* <th>Slika artikla</th> */}
                            <th>Artikal</th>
                            <th className="text-right">Količina</th>
                            <th className="text-right">Cijena</th>
                            <th className="text-right">Ukupno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.cart?.cartArticles && orders.cart?.cartArticles.map(item=>{
                            // const image = item.article.photos[item.article.photos?.length-1].imagePath;
                            const articlePrice = getLatestPriceBeforeDate(item.article, orders.cart?.createdAt)
                            const price = Number(articlePrice.price).toFixed(2)
                            const total = Number(articlePrice.price * item.quantity).toFixed(2);
                            return(
                                <tr key={item.articleId}>
                                    {/* <td><img src={ApiConfig.PHOTO_PATH + 'thumb/' + image} alt="" /></td> */}
                                    {/* <td>{item.article.category.name}</td> */}
                                    <td>{item.article.name}</td>
                                    <td className="text-right">{item.quantity}</td>
                                    <td className="text-right">{price} EUR</td>
                                    <td className="text-right">{total} EUR</td>
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
        </Modal>
        </Container>
    )
}
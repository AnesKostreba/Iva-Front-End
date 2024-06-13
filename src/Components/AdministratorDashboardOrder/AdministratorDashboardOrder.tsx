import { useEffect, useState } from "react";
import ApiOrderDto from "../../dtos/ApiOrderDto";
import api, { ApiResponse } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { RoledMainMenu } from "../RoledMainMenu/RoledMainMenu";
import { Button, Card, CardBody, CardTitle, Container, Modal, ModalBody, ModalHeader, ModalTitle, Tab, Table, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faCartArrowDown, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import CartType from "../../types/CartType";
import OrderType from "../../types/OrderType";
import './AdministratorDashboardOrder.css'

interface AdministratorDashboardOrderState{
    isAdministratorLoggedIn: boolean;
    cartVisible: boolean;
    cart?: CartType;
    orders: ApiOrderDto[];
}

export const AdministratorDashboardOrder = () =>{
    const navigate = useNavigate()
    const[adminOrder, setAdminOrder] = useState<AdministratorDashboardOrderState>({
        orders: [],
        isAdministratorLoggedIn: true,
        cartVisible: false
    });
    
    const setOrders = (orders: ApiOrderDto[]) =>{
        setAdminOrder(prevState =>({
            ...prevState,
            orders: orders
        }))
    }

    const setLogginState = (isLoggedIn: boolean) =>{
        setAdminOrder(prevState =>({
            ...prevState,
            isAdministratorLoggedIn: isLoggedIn
        }))
    }

    const setCartVisibleState = (orders: boolean) =>{
        setAdminOrder(prevState =>({
            ...prevState,
            cartVisible: orders
        }))
    }

    const setCartState = (cart: CartType) =>{
        setAdminOrder(prevState =>({
            ...prevState,
            cart: cart
        }))
    }

    const hideCart = () =>{
        setCartVisibleState(false);
    }
    const showCart = () =>{
        setCartVisibleState(true);
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
        if(!adminOrder.cart || !adminOrder.cart?.cartArticles){
            return sum;
        }else{

            for(const item of adminOrder.cart.cartArticles){
               
                let price = getLatestPriceBeforeDate(item.article,adminOrder.cart.createdAt)
                
                if(price !== undefined){
                    sum += price.price * item.quantity;
                }
            }
        }

        return sum;
    }


    const sum = calculateSum();

    useEffect(()=>{
        api('api/order/', 'get', {}, 'administrator')
            .then((res: ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }

                const data:ApiOrderDto[] = res.data;

                if(adminOrder.isAdministratorLoggedIn === false){
                    navigate('/administrator/login')
                }

                setOrders(data);
            })
    },[])

    const reloadOrders = () =>{
        api('api/order/', 'get', {}, 'administrator')
            .then((res: ApiResponse)=>{
                if(res?.status === 'error' || res?.status === 'login'){
                    setLogginState(false);
                    return;
                }

                const data:ApiOrderDto[] = res.data;

                if(adminOrder.isAdministratorLoggedIn === false){
                    navigate('/administrator/login')
                }
                setOrders(data);
            })
    }
    useEffect(()=>{
        reloadOrders();
    },[])

    const changeStatus = (orderId: number, newStatus: "rejected" | "accepted" | "shipped" | "pending") =>{
        api('api/order/'+orderId,'patch',{ newStatus}, 'administrator')
        .then((res: ApiResponse)=>{
            if(res?.status === 'error' || res?.status === 'login'){
                setLogginState(false);
                return;
            }
            reloadOrders();
        })
    }

    
    

    const setAndShowCart = (cart: CartType) =>{
        setCartState(cart)
        showCart()
    }

    const printStatusChangeButtons = (order:OrderType) =>{
        if(order.status === 'pending'){
            return(
                <>
                    <Button className="buttons p-2" size="sm" variant="outline-success" 
                            onClick={ () =>changeStatus(order.orderId, 'accepted')}>

                        <FontAwesomeIcon className="iconFa" icon={faCheck}/>Prihvati</Button>
                    <Button type="button" className="p-2" variant="danger" size="sm"
                            onClick={ () =>changeStatus(order.orderId, 'rejected')}>
                        <FontAwesomeIcon className="iconFa" icon={faXmark}/>Odbij</Button>
                </>
            )
        }

        if(order.status === 'accepted'){
            return(
                <>
                    <Button className="buttons p-2" size="sm" variant="outline-success"
                            onClick={ () =>changeStatus(order.orderId, 'shipped')}>
                                <FontAwesomeIcon className="iconFa" icon={faCheck}/>Pošalji</Button>
                    <Button className="p-2" type="button" variant="secondary" size="sm"
                            onClick={ () =>changeStatus(order.orderId, 'pending')}>Vrati na čekanje</Button>
                </>
            )
        }

        if(order.status === 'shipped'){
            return(
                <>
                    
                </>
            )
        }

        if(order.status === 'rejected'){
            return(
                <>
                    <Button className="p-2" type="button" variant="secondary" size="sm"
                            onClick={ () =>changeStatus(order.orderId, 'pending')}>Vrati na čekanje</Button>
                </>
            )
        }
    }

    const statusTranslations = {
        pending: 'Na čekanju',
        accepted: 'Prihvaćeno',
        shipped: 'Poslato',
        rejected: 'Odbijeno',
    };
    const orders = Array.isArray(adminOrder.orders) ? adminOrder.orders : [];
    

    const renderOrders = (withStatus: "rejected" | "accepted" | "shipped" | "pending") =>{

        const formatDateTimeOrder = orders
                                    .filter(order => order.status === withStatus)
                                    .map(order => {
                                        const createdAt = new Date(order.createdAt);
                                        const formatDate = createdAt.toLocaleDateString('sr-RS',{
                                            day : 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })

                                        const formatTime = createdAt.toLocaleTimeString('sr-RS',{
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })

                                        return{
                                            ...order,
                                            formatDate,
                                            formatTime
                                        }
                                    })
        return(
            <Table hover size="sm" bordered>
                <thead>
                    <tr>
                        <th className="text-end">Porudžbina broj</th>
                        <th>Datum</th>
                        <th>Status</th>
                        <th>Korpa</th>
                        <th>Opcije</th>
                    </tr>
                </thead>
                <tbody>
                    {formatDateTimeOrder.map(order =>(
                        <tr>
                        <td className="text-end">{order.orderId}</td>
                        <td>{order.formatDate}{order.formatTime}</td>
                        <td>{statusTranslations[order.status]}</td>
                        <td>
                        <Button className="p-2" size="sm" variant="outline-success" 
                            onClick={ () => setAndShowCart(order.cart)}>
                            <FontAwesomeIcon icon={faBoxOpen}/> Pregredaj korpu
                        </Button>
                        </td>
                        <td>
                            {
                                printStatusChangeButtons(order)
                            }
                        </td>
                    </tr>
                    ))}
                    {/* {orders
                        .filter(order => order.status === withStatus)
                        .map( order => (
                        <tr>
                            <td className="text-end">{order.orderId}</td>
                            <td>{formatDateTimeOrder}</td>
                            <td>{statusTranslations[order.status]}</td>
                            <td>
                            <Button className="p-2" size="sm" variant="outline-success" 
                                onClick={ () => setAndShowCart(order.cart)}>
                                <FontAwesomeIcon icon={faBoxOpen}/> Pregredaj korpu
                            </Button>
                            </td>
                            <td>
                                {
                                    printStatusChangeButtons(order)
                                }
                            </td>
                        </tr>
                    ),this)}  */}
                </tbody>
            </Table>
        )
    }

    return (
        <>
        <RoledMainMenu role="administrator"/>
        <Container>
            
            <Card className="mt-2">
                <CardBody>
                    <CardTitle >
                        <FontAwesomeIcon className="kategorijeIcon" icon={faCartArrowDown}/>Porudžbine
                    </CardTitle>
                    <Tabs defaultActiveKey='pending' id="order'tabs">
                        <Tab eventKey="pending" title={statusTranslations['pending']}>
                            {renderOrders('pending')}
                        </Tab> 
                        <Tab eventKey="accepted" title={statusTranslations['accepted']}>
                            {renderOrders('accepted')}
                        </Tab> 
                        <Tab eventKey="shipped" title={statusTranslations['shipped']}>
                            {renderOrders('shipped')}
                        </Tab> 
                        <Tab eventKey="rejected" title={statusTranslations['rejected']}>
                            {renderOrders('rejected')}
                        </Tab> 
                    </Tabs>

                    
                </CardBody>
              </Card>

        <Modal size="lg" centered show={adminOrder.cartVisible} onHide={()=> hideCart()}>
            <ModalHeader closeButton className="vasaKorpa">
                <ModalTitle className="">Korpa porudžbine</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Table className="border" hover size="sm">
                    <thead>
                        <tr>
                            {/* <th>Slika artikla</th> */}
                            <th>Artikal</th>
                            <th >Količina</th>
                            <th >Cijena</th>
                            <th >Ukupno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminOrder.cart?.cartArticles && adminOrder.cart?.cartArticles.map(item=>{
                            // const image = item.article.photos[item.article.photos?.length-1].imagePath;
                            const articlePrice = getLatestPriceBeforeDate(item.article, adminOrder.cart?.createdAt)
                            const price = Number(articlePrice.price).toFixed(2)
                            const total = Number(articlePrice.price * item.quantity).toFixed(2);
                            return(
                                <tr key={item.articleId}>
                                    {/* <td><img src={ApiConfig.PHOTO_PATH + 'thumb/' + image} alt="" /></td> */}
                                    {/* <td>{item.article.category.name}</td> */}
                                    <td>{item.article.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{price} EUR</td>
                                    <td>{total} EUR</td>
                                </tr>
                            )
                        }, this)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td className="text-end"><strong>Ukupno:</strong></td>
                            <td className="text-right">{Number(sum).toFixed(2)} EUR</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </Table>
                <Table>
                    <thead><strong>Podatci o korisniku:</strong></thead>
                    
                    <tbody>
                        {adminOrder.cart?.user && (
                            <td className="p-2">
                                <tr><strong className="strong">Email:</strong>{adminOrder.cart.user.email}</tr>
                                <tr><strong className="strong">Ime:</strong>{adminOrder.cart.user.forname}</tr>
                                <tr><strong className="strong">Prezime:</strong>{adminOrder.cart.user.surname}</tr>
                                <tr><strong className="strong">Adresa:</strong>{adminOrder.cart.user.postalAddress}</tr>
                                <tr><strong className="strong">Broj telefona:</strong>{adminOrder.cart.user.phoneNumber}</tr>
                            </td>
                        )}
                    </tbody>
                </Table>
            </ModalBody>
        </Modal>
        </Container>
        </>
    )
}
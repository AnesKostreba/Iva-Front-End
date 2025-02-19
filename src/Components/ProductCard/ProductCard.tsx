import { Button, Card, CardBody, CardText, CardTitle, Modal, ModalBody, ModalHeader} from "react-bootstrap";
import { ApiConfig } from "../../config/api.config";
import './ProductCard.css';
import { ArticleType } from "../../types/ArticleType";
import { Link, redirect, useNavigate} from "react-router-dom";
import { useState } from "react";
import api, {ApiResponse, getRole, Role} from '../../api/api';

interface ProductCardProps {
    article : ArticleType
}

interface SingleARticlePreviewState{
    quantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({article}) =>{
    const role: Role = getRole();
    const [quantity, setQuantity] = useState<number>(1)
    const decrementQuantity = () =>{
        if(quantity > 1){
            setQuantity(prevQuantity => prevQuantity -1)
        }
    }
    const incrementQuantity = () =>{
        setQuantity(prevQuantity => prevQuantity + 1);
    }

    const[showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const navigate = useNavigate();

    
    const addToCart = () =>{
        if(role === 'visitor' || role === 'administrator'){
            // alert('Niste ulogovani... Ulogujte se da biste dodali proizvode u korpu.')
            handleShowModal();
            return;
        }

        const data = {
            articleId: article.articleId,
            quantity: quantity
        };

        api('/api/user/cart/addToCart/',"post",data,undefined,role)
            .then((res: ApiResponse | undefined) =>{
                if(res?.status === 'error'){
                    return;
                }

            window.dispatchEvent(new CustomEvent('cart.update'));
        })
    }
    const scroll = () =>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    const renderModal = () =>{
        return(
            <Modal show={showModal} onHide={handleCloseModal}>
                <ModalHeader><span className="text-danger">Obaveštenje</span>
                    <Button className="btn-success"
                        onClick={()=>{
                            handleCloseModal();
                        }}
                    >Zatvori</Button>
                </ModalHeader>
                <ModalBody>Niste ulogovani. <span className="spanLogin" onClick={()=>{
                    navigate('/user/login');
                    scroll();
                }}>Ulogujte se</span> da dodate artikle u korpu.</ModalBody>
            </Modal>
        )
    } 

    return(
        <Card className="mt-3 kartica">
            <Link to={`/article/${article.articleId}`} onClick={scroll}>
                <img className="w-100 mt-2 p-3" src={ApiConfig.PHOTO_PATH+"small/"+article.imageUrl} alt={article.name}></img>
                <CardTitle as='p' className="mt-4 text-center nazivArtikla p-1 d-flex flex-column">
                    <strong>{article.name}</strong>
                    <span className="articleDisabled">{article.status === 'visible' ? 'Proizvod nije na stanju' : ''}</span>
                </CardTitle>
            </Link>
            <CardBody className="bodyCard p-3 mt-4">
                <CardText className="text-center cenaArtikla">
                    Cena:  {Number(article.price).toFixed(2)} EUR
                </CardText>
                <div className="omotac d-flex">
                    <div className="w-100 d-flex omotacPovecanje border">
                            <div className="d-flex w-100 ">
                                <button disabled={article?.status === 'visible'}
                                         onClick={decrementQuantity} className="w-100 minus">-</button>
                            </div>
                            <div className="w-100 text-center  justify-content-center align-items-center d-flex">
                                <p className="m-0">{quantity}</p>
                            </div>
                            <div className="d-flex w-100 ">
                                <button disabled={article?.status === 'visible'} 
                                        onClick={incrementQuantity} className="w-100 plus">+</button>
                            </div>
                    </div> 
                    <div className="w-100 bg-dark d-flex kupi">
                        <button onClick={addToCart}
                         disabled ={article?.status === 'visible'}
                         className="w-100">Kupi</button>
                         {renderModal()}
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
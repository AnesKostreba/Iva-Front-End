import { Card, CardBody, CardText, CardTitle, Col, Container, Row } from "react-bootstrap";
import { ApiConfig } from "../../config/api.config";
import './ProductCard.css';
import { ArticleType } from "../../types/ArticleType";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    article : ArticleType
}

export const ProductCard: React.FC<ProductCardProps> = ({article}) =>{

    return(
        <Card className="mt-3 ">
            <img className="w-100 mt-2 p-3" src={ApiConfig.PHOTO_PATH+"small/"+article.imageUrl} alt={article.name}></img>
            <CardTitle as='p' className="mt-4 text-center nazivArtikla">
                <strong>{article.name}</strong>
            </CardTitle>
            <CardBody className="bodyCard p-3 mt-4">
                <CardText className="text-center cenaArtikla">
                    Cena:  {Number(article.price).toFixed(2)} EUR
                </CardText>
                <div className="omotac d-flex">
                    <div className="w-100 d-flex omotacPovecanje border">
                            <div className="d-flex w-100 ">
                                <button className="w-100 minus">-</button>
                            </div>
                            <div className="w-100 text-center  justify-content-center align-items-center d-flex">
                                <p className="m-0">1</p>
                            </div>
                            <div className="d-flex w-100 ">
                                <button className="w-100 plus">+</button>
                            </div>
                        
                    </div> 
                    <div className="w-100 bg-dark d-flex kupi">
                        <button className="w-100">Kupi</button>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
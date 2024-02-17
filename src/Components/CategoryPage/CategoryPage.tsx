import { useParams } from "react-router-dom";
import { CategoryType } from "../../types/CategoryType";
import { useEffect, useState } from "react";
import { Card, CardText, CardTitle, Container } from "react-bootstrap";

interface CategoryPageState{
    category?: CategoryType;
}

export const CategoryPage = () =>{
    const {id} = useParams<{id: string}>();

    const [categoryState, setCategoryState] = useState<CategoryPageState>({

    }) 

    useEffect(()=>{
        if(id !== categoryState.category?.categoryId){
            setTimeout(() =>{
                const data: CategoryType = {
                    name: `Category${id}`,
                    categoryId: categoryState.category?.categoryId,
                    items: []
                }
                setCategoryState({category: data})
            }, 210)
        }
    },[id,categoryState.category?.categoryId])

    return(
        <Container>
            <Card>
                <CardTitle>
                    {categoryState.category?.name}
                </CardTitle>
                <CardText>
                    Here, we will have our article
                </CardText>
            </Card>
        </Container>
    )
}
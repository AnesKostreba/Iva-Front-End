import { ArticleType } from "./ArticleType";

export interface CategoryType{
    categoryId?: number;
    name?: string;
    items?: ArticleType[];
    
}
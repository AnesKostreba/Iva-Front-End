export interface CategoryType {
    categoryId?: number;
    name?: string;
    imagePath?: string;
    parentCategoryId?: number | null;
    subcategories?: CategoryType[];
}
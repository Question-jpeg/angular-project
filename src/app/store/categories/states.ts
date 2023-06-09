
import { Category } from "shared/models/categories";

export interface CategoryState {
    collection: Category[],
    isFetching: boolean,
    selectedCategoriesIds: string[],
    selectedCategoryId: string
}

export const initialCategoryState: CategoryState = {
    collection: [],
    isFetching: false,
    selectedCategoriesIds: [],
    selectedCategoryId: ''
}
import { createActionGroup, createReducer, on, props } from '@ngrx/store';
import { CategoryState, initialCategoryState } from './states';
import { Category } from 'shared/models/categories';

export const categoryActions = createActionGroup({
  source: 'categories',
  events: {
    'Set Fetching': props<{ isFetching: boolean }>(),
    'Fetch categories': props<{ categories: Category[] }>(),
    'Toggle Category Selection': props<{ id: string }>(),
    'Select Categories': props<{categoriesIds: string[]}>(),
    'Select Category': props<{id: string}>()
  },
});

const setFetching = on(
  categoryActions.setFetching,
  (state: CategoryState, { isFetching }): CategoryState => ({
    ...state,
    isFetching,
  })
);

const fetchCategories = on(
  categoryActions.fetchCategories,
  (state: CategoryState, { categories }): CategoryState => ({
    ...state,
    collection: categories,
  })
);

const toggleCategorySelection = on(
  categoryActions.toggleCategorySelection,
  (state: CategoryState, { id }): CategoryState => {
    if (state.selectedCategoriesIds.includes(id))
      return {
        ...state,
        selectedCategoriesIds: state.selectedCategoriesIds.filter(
          (sId) => sId !== id
        ),
      };
    return {
      ...state,
      selectedCategoriesIds: [...state.selectedCategoriesIds, id],
    };
  }
);

const selectCategories = on(
  categoryActions.selectCategories,
  (state: CategoryState, { categoriesIds }): CategoryState => ({
    ...state,
    selectedCategoriesIds: categoriesIds
  })
)

const selectCategory = on(
  categoryActions.selectCategory,
  (state: CategoryState, { id }): CategoryState => ({
    ...state,
    selectedCategoryId: id
  })
)

export const categoriesReducer = createReducer(
  initialCategoryState,
  setFetching,
  fetchCategories,
  toggleCategorySelection,
  selectCategories,
  selectCategory
);

import { ingredient } from "../../shared/ingredient.model";
import { ADD_INGREDIENT, ADD_INGREDIENTS, DELETE_INGREDIENT, ShoppingListActions, START_EDIT, STOP_EDIT, UPDATE_INGREDIENT } from "./shopping-list.actions";

export interface State {
  ingredients: ingredient[];
  editedIngredient: ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State
}

const initialState: State = {
  ingredients: [
    new ingredient('Apples', 5),
    new ingredient('Tomatoes', 10),
  ],
  editedIngredient: null,
  editedIngredientIndex: -1,
}

export function shoppingListReducer (state: State = initialState, action: ShoppingListActions){

  switch (action.type) {
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case UPDATE_INGREDIENT:

      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      }
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (ingredient, ingredientIndex) => {
            return ingredientIndex !== state.editedIngredientIndex;
          }
        ),
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    default:
      return state;
  }
}

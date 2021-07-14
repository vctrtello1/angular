import { ingredient } from "../../shared/ingredient.model";
import { ADD_INGREDIENT, ADD_INGREDIENTS, DELETE_INGREDIENT, ShoppingListActions, UPDATE_INGREDIENT } from "./shopping-list.actions";

const initialState = {
  ingredients: [
    new ingredient('Apples', 5),
    new ingredient('Tomatoes', 10),
  ]
}

export function shoppingListReducer (state = initialState, action: ShoppingListActions){

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

      const ingredient = state.ingredients[action.payload.index];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient
      }
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[action.payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (ingredient, ingredientIndex) => {
            return ingredientIndex !== action.payload;
          }
        )
      };
    default:
      return state;
  }
}

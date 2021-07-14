import { ingredient } from "../../shared/ingredient.model";
import { AddIngredient, ADD_INGREDIENT, ADD_INGREDIENTS, ShoppingListActions } from "./shopping-list.actions";

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
    default:
      return state;
  }
}

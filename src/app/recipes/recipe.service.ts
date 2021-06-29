import { EventEmitter, Injectable } from '@angular/core';
import { ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes =[
    new Recipe('A recipe of Caviar',
    'This is an example of Caviar',
     'https://cdn.onemars.net/sites/nutro_es_NkyIN_B9cV/image/gettyimages-605382371_1615921436612.jpeg',
     [
       new ingredient('Meat', 1),
       new ingredient('French Fries', 20),
     ]),
     new Recipe('A recipe of Lobster',
     'This is an example of Lobster',
     'https://cdn.onemars.net/sites/nutro_es_NkyIN_B9cV/image/gettyimages-605382371_1615921436612.jpeg',
     [
       new ingredient('Buns', 2),
       new ingredient('Meat', 1),
     ])
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(){
    return this.recipes.slice();
  }

  addToShoppingList(ingredients: ingredient[]){
    this.shoppingListService.addIngredients(ingredients);
  }
}
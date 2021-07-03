import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

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

  getRecipe(id: number){
    return this.recipes[id];
  }

  addToShoppingList(ingredients: ingredient[]){
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}

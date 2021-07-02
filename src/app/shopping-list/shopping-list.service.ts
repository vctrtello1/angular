import { Subject } from 'rxjs';
import { ingredient } from '../shared/ingredient.model';

export class ShoppingListService{
  ingredientsChanged = new Subject<ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: ingredient[] = [
    new ingredient('Apples', 5),
    new ingredient('Tomatoes', 10)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }
  getIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient(ingredient: ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from 'rxjs/operators'
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import { setRecipes } from "../recipes/store/recipe.actions";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient,
    private recipesService: RecipeService,
    private store: Store<AppState>) { }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://recipes-38079-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {

    return this.http.get<Recipe[]>(
      'https://recipes-38079-default-rtdb.firebaseio.com/recipes.json',
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.store.dispatch(new setRecipes(recipes));
      })
    )

  }
}

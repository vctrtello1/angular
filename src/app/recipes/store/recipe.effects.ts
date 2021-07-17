import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { dispatch } from "rxjs/internal/observable/pairs";
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { AppState } from "src/app/store/app.reducer";
import { Recipe } from "../recipe.model";
import { FETCH_RECIPES, setRecipes, STORE_RECIPES } from "./recipe.actions";

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://recipes-38079-default-rtdb.firebaseio.com/recipes.json',
      )
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new setRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(ofType(STORE_RECIPES),
  withLatestFrom(this.store.select('recipes')),
  switchMap(([actionData, recipesState]) => {
    return this.http.put('https://recipes-38079-default-rtdb.firebaseio.com/recipes.json', recipesState.recipes)
  }));

  constructor(private actions$: Actions, private http: HttpClient,
    private store: Store<AppState>) {

  }
}

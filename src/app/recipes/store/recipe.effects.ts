import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { switchMap, map } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import { FETCH_RECIPES, SetRecipes } from "./recipe.actions";

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
      return new SetRecipes(recipes);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {

  }
}

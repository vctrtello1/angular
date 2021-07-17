import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { AppState } from "../store/app.reducer";
import { Recipe } from "./recipe.model";
import { fetchRecipes, SET_RECIPES } from "./store/recipe.actions";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<AppState>,
    private actions$: Actions){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new fetchRecipes());
          return this.actions$.pipe(ofType(SET_RECIPES), take(1));
        }
        else {
          of(recipes);
        }
      })
    );


  }
}

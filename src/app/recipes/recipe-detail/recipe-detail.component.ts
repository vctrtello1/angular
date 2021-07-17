import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import { map, switchMap } from 'rxjs/operators'
import { deleteRecipe } from '../store/recipe.actions';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(){
    this.route.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList(){
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe(){
    this.router.navigate(['edit'],{relativeTo: this.route});
  }

  onDeleteRecipe(){
    this.store.dispatch(new deleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}

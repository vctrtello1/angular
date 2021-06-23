import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes =[
    new Recipe('A recipe of Caviar', 'This is an example of Caviar',
     'https://cdn.onemars.net/sites/nutro_es_NkyIN_B9cV/image/gettyimages-605382371_1615921436612.jpeg'),
     new Recipe('A recipe of Lobster', 'This is an example of Lobster',
     'https://cdn.onemars.net/sites/nutro_es_NkyIN_B9cV/image/gettyimages-605382371_1615921436612.jpeg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe){
    this.recipeWasSelected.emit(recipe);
  }

}

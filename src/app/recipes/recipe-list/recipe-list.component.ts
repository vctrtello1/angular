import { Component, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes =[
    new Recipe('A recipe', 'This is an exame', 'https://cdn.onemars.net/sites/nutro_es_NkyIN_B9cV/image/gettyimages-605382371_1615921436612.jpeg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

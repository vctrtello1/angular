import { Recipe } from './recipe.model';

export class RecipeService {

  private recipes =[
    new Recipe('A recipe of Caviar', 'This is an example of Caviar',
     'https://cdn.onemars.net/sites/nutro_es_NkyIN_B9cV/image/gettyimages-605382371_1615921436612.jpeg'),
     new Recipe('A recipe of Lobster', 'This is an example of Lobster',
     'https://cdn.onemars.net/sites/nutro_es_NkyIN_B9cV/image/gettyimages-605382371_1615921436612.jpeg')
  ];

  getRecipes(){
    return this.recipes.slice();
  }
}

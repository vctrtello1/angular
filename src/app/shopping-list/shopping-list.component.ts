import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

import { ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: ingredient[];
  private ingredientsChangedSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService,
    private loggingService: LoggingService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangedSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
    this.loggingService.printLog('Hello from shopping-list component ngOnInit');
  }

  ngOnDestroy(){
    this.ingredientsChangedSubscription.unsubscribe();
  }

  onEditItem(index: number){
    this.shoppingListService.startedEditing.next(index);
  }

}

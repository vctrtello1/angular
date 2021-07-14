import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging.service';

import { ingredient } from '../shared/ingredient.model';
import { StartEdit } from './store/shopping-list.actions';
import { AppState } from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable< {ingredients: ingredient[]} >;

  constructor(private loggingService: LoggingService,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    this.loggingService.printLog('Hello from shopping-list component ngOnInit');
  }

  onEditItem(index: number){
    this.store.dispatch(new StartEdit(index));
  }

}

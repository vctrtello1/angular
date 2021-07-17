import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logout } from '../auth/store/auth.actions';
import { fetchRecipes } from '../recipes/store/recipe.actions';
import { DataStorageService } from '../shared/data-storage.service';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  private userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService,
    private store: Store<AppState>) {}

  onSaveData(){
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.store.dispatch(new fetchRecipes())
  }

  onLogout(){
    this.store.dispatch(new Logout());
  }

  ngOnInit() {
    this.userSubscription = this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(
      user => {
        this.isAuthenticated = !!user;
        console.log(!user);
        console.log(!!user);
      }
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}

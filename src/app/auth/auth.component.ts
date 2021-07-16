import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AppState } from '../store/app.reducer';
import { ClearError, LoginStart, SignupStart } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private errorSubscription: Subscription;
  private storeSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>) { }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){

    if (!form.valid){
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(new LoginStart({
        email: email,
        password: password
      }));
    }
     else {
      this.store.dispatch(new SignupStart({
        email: email,
        password: password
      }));
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new ClearError());
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef =  hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = message;
    this.errorSubscription = componentRef.instance.close.subscribe(() => {
      this.errorSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }

    if(this.storeSubscription){
      this.storeSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error){
        this.showErrorAlert(this.error);
      }
    });
  }

}

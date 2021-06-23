import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('...', { static: false}) nameInputRef: ElementRef;
  @ViewChild('...', { static: false}) amountInputRef: ElementRef;
  @Output() ingredientAdded = new EventEmitter <ingredient>();

  constructor() { }

  ngOnInit(): void {
  }

  onAddItem(){
    const ingName = this.nameInputRef.nativeElement.value;
    const ingAmount = this.amountInputRef.nativeElement.value;
    const newIngredient = new ingredient(ingName, ingAmount);
    this.ingredientAdded.emit(newIngredient);
  }

}

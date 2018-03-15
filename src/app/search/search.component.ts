import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() sendRecipes = new EventEmitter();

  inputs: String[]= ['0'];
  ingredients: String;
  public myForm: FormGroup;
  itemsGroup: FormArray;
  constructor(private fb: FormBuilder, private recipeService: RecipeService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
        'search': this.fb.array([this.createItem()])
    });
  }

  addSearchBox(): void {
    const inputLength = this.inputs.length;
    const lastIndex = Number(this.inputs[inputLength - 1]);
    if (lastIndex < 10) {
      this.itemsGroup = this.myForm.get('search') as FormArray;
      this.itemsGroup.push(this.createItem())
      this.inputs.push((lastIndex + 1).toString());
    }
  }

  private createItem() {
    return this.fb.group({
      name: ''
    });
  }
  search() {
    const values = this.myForm;
    this.ingredients = '';
    this.recipeService.getRecipe(this.ingredients).subscribe(result => {
      this.sendRecipes.emit(result);
    });
  }
  removeSearchBox(){
    const inputLength = this.inputs.length;
    const lastIndex = Number(this.inputs[inputLength - 1]);
    if (lastIndex > 0) {
      this.itemsGroup = this.myForm.get('search') as FormArray;
      this.itemsGroup.removeAt(lastIndex);
      this.inputs.pop();
    }
  }
}

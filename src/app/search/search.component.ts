import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import {RecipeService} from '../recipe.service';
import {RecipeModel} from '../Models/recipeModel';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() sendRecipes = new EventEmitter<RecipeModel>();

  recipes: RecipeModel;
  inputs: String[]= ['0'];
  ingredients: String;
  public myForm: FormGroup;
  collapsed: Boolean = true;
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
    let ingredients = this.myForm.controls.search.value.reduce(((ingredients, value) => {
        ingredients.push(value.name);
        return ingredients;
    }), []);
    ingredients = ingredients.concat(',');
    this.recipeService.getRecipe(ingredients).subscribe(result => {
      const count = result['count'] || 0;
      const recipes = this.getRecipes(result['hits']);
      this.sendRecipes.emit({
        RecipeObject: recipes,
        count: count
      });
    });
  }
  getRecipes(recipes){
    let recipesList = recipes.reduce((recipesList, recipe) => {
        let tempRecipe = {};
        tempRecipe['ingredients'] = recipe.recipe.ingredientLines;
        tempRecipe['calories'] = recipe.recipe.calories;
        tempRecipe['nutrients'] = this.getNutrients(recipe.recipe.totalNutrients);
        tempRecipe['dailyNutrients'] = this.getNutrients(recipe.recipe.totalDaily);
        tempRecipe['image'] = recipe.recipe.image;
        tempRecipe['title'] = recipe.recipe.label;
        tempRecipe['recipieUrl'] = recipe.recipe.url;
        recipesList.push(tempRecipe);
        return recipesList;
    }, []);
    return recipesList;
  }
  getNutrients(nutrients){
    const nutrientsList = [];
    Object.keys(nutrients).forEach(nutrientObj => {
      const tempObj = [];
      const nutrient = nutrients[nutrientObj];
      tempObj.push(nutrient['label']);
      tempObj.push(nutrient['quantity'].toString() + ' ' + nutrient['unit']);
      nutrientsList.push(tempObj);
    });
    return nutrientsList;
  }
  removeSearchBox(index) {
    if (index > 0) {
      this.itemsGroup = this.myForm.get('search') as FormArray;
      this.itemsGroup.removeAt(index);
      this.inputs.pop();
      if(this.itemsGroup.length < 5 && this.collapsed){
        this.collapsed = false;
      }
    }
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }
}

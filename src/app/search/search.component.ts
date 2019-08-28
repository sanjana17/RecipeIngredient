import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import {RecipeService} from '../recipe.service';
import {RecipeModel} from '../Models/recipeModel';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {IngredientCheckDirective} from '../directives/validators/ingredient-check.directive';
import {AppGlobal} from "../Content/AppGlobal";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [AppGlobal]
})
export class SearchComponent implements OnInit {
  @Output() sendRecipes = new EventEmitter<RecipeModel>();

  recipes: RecipeModel = new RecipeModel({
    RecipeObject:[]
  });
  inputs: String[]= ['0'];
  ingredients: String;
  public myForm: FormGroup;
  collapsed: Boolean = true;
  itemsGroup: FormArray;
  hideHeader:Boolean;
  constructor(private fb: FormBuilder,
              private recipeService: RecipeService,
              private spinnerService: Ng4LoadingSpinnerService,
              public appGlobal:AppGlobal,
              public translate: TranslateService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
        'search': this.fb.array([this.createItem()])
    });
    this.translate.setDefaultLang(this.appGlobal.defaultContent);
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
      name: ['', Validators.compose([IngredientCheckDirective(/[^a-zA-Z ]/g)])]
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
      this.spinnerService.hide();
      const count = result['count'] || 0;
      const recipes = this.recipes.getRecipes(result['hits']);
      this.sendRecipes.emit(new RecipeModel({
        RecipeObject: recipes,
        count: count,
        originalList: result
      }));
    });
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

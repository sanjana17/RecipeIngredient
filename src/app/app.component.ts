import { Component } from '@angular/core';
import {RecipeService} from './recipe.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RecipeService]
})
export class AppComponent {
  title = 'app';
  ingredient = '';
  public recipe: Object;

  constructor(private recipeService: RecipeService) {}
  sendRecipes(result) {
    console.log(result);
  }
}

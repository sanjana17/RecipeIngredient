import { Component, OnInit } from '@angular/core';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css'],
  providers: [RecipeService]
})
export class RecipeSearchComponent implements OnInit {
  public recipe: Object;
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }
  sendRecipes(result) {
    this.recipe = result;
  }

}

import { Component, OnInit } from '@angular/core';
import {RecipeService} from '../recipe.service'

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css'],
  providers: [RecipeService]
})
export class ViewRecipeComponent implements OnInit {
  ingredient = '';
  public recipeObject: Object;
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }
  getRecipeForIngredient() {
    this.recipeService.getRecipe(this.ingredient).subscribe(result => this.recipeObject = {
      count: result['count'],
      hits: result['hits']
    });
  }

}

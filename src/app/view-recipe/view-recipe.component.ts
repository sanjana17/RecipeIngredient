import {Component, Input, OnInit} from '@angular/core';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css'],
  providers: [RecipeService]
})
export class ViewRecipeComponent implements OnInit {
  @Input() recipes;
  ingredient = '';
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipes = [];
  }

}

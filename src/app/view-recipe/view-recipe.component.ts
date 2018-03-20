import {Component, Input, OnInit} from '@angular/core';
import {RecipeService} from '../recipe.service';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css'],
  providers: [RecipeService, NgbTooltipConfig]
})
export class ViewRecipeComponent implements OnInit {
  @Input() recipes;
  ingredient = '';
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipes = [];
  }

}

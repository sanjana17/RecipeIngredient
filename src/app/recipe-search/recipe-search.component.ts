import { Component, OnInit } from '@angular/core';
import {RecipeService} from '../recipe.service';
import {RecipeModel} from '../Models/recipeModel';
import {Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  host: {'(window:scroll)' : 'onWindowScroll()'},
  styleUrls: ['./recipe-search.component.css'],
  providers: [RecipeService]
})
export class RecipeSearchComponent implements OnInit {
  public recipe: RecipeModel;
  hideHeader: Boolean = false;
  constructor(private recipeService: RecipeService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {}
  sendRecipes(result) {
    this.hideHeader = true;
    this.recipe = result;
  }
  onWindowScroll() {
    if (!(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100)) {
      if (this.hideHeader && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
        this.hideHeader = false;
      }
    } else {
      this.hideHeader = true;
    }
  }
}

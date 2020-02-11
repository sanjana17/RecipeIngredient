import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class RecipeService {
  constructor(private http: HttpClient, private spinnerService: Ng4LoadingSpinnerService) { }
  appId = '783f060b';
  appKey = 'ed4c2f7ae06ec17c252afd0cbb0e947b';
  apiURL = 'https://api.edamam.com/search';
  getRecipe(ingredient, excludes) {
    const recipeUrl = this.apiURL + '?q=' + ingredient + '&app_id=' + this.appId + '&app_key=' + this.appKey + '&from=0&to=100&' + excludes;
    this.spinnerService.show();
    return this.http.get(recipeUrl);
  }
}



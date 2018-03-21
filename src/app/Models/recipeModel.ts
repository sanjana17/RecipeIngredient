export class RecipeModel {
  RecipeObject?: Object[] = [];
  count?: Number = 0;
  originalList?: any;
  constructor(private recipes) {
    if (recipes) {
      this.RecipeObject = recipes.RecipeObject;
      this.count = recipes.count;
      this.originalList = recipes.originalList;
    }
  }
  getFilterList(){
    const recipeResult = this.originalList;
    return [];
  }
  getFilteredItem(filterType){
    const recipeResult = this.originalList;
  }
}

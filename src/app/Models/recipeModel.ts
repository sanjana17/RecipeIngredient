export class RecipeModel {
  RecipeObject?: Object[] = [];
  count?: Number = 0;
  originalList?: any;
  previousList?: Object[] = []
  currentIndex = 10;

  constructor(private recipes) {
    if (recipes) {
      this.previousList = recipes.RecipeObject;
      this.pollRecipeData();
      this.count = recipes.count;
      this.originalList = recipes.originalList;
    }
  }

  getFilterList() {
    const labels = [];
    const recipeResult = this.originalList.hits;
    recipeResult.forEach(recipe => {
      recipe.recipe.dietLabels.forEach(dietLabel => {
        if (labels.indexOf(dietLabel) > -1) {
          return;
        }
        else {
          labels.push(dietLabel);
        }
      })
    });
    return labels;
  }

  getSortResults(sortType, filterValue) {
    const tempObj = this.RecipeObject;
    var sortMap = {
      "Low-Carb": {
        "ASC": "Carbs",
        "DESC": "Carbs"
      },
      "High-Protein": {
        "ASC": "Protien",
        "DESC": "Protien"
      },
      "Low-Fat": {
        "ASC": "Fat",
        "DESC": "Fat"
      },
      "Relevance": {
        "ASC": "Protien",
        "DESC": "Protien"
      },
      "Balanced": {
        "ASC": "Fat",
        "DESC": "Fat"
      }
    };
    const sortParameter = sortMap[filterValue][sortType];

    function compare(a, b) {
      if (a.majorNutrients[sortParameter] < b.majorNutrients[sortParameter])
        return sortType === 'ASC' ? -1 : 1;
      if (a.majorNutrients[sortParameter] > b.majorNutrients[sortParameter])
        return sortType === 'ASC' ? 1 : -1;
      return 0;
    }

    this.RecipeObject = tempObj.sort(compare);
  }

  getFilteredItem(filterType) {
    const resultArr = [];
    const tempObj = this.previousList;
    tempObj.forEach(obj => {
      if (obj['dietLabels'].indexOf(filterType)) {
        resultArr.push(obj);
      }
    });
    this.RecipeObject = resultArr.length ? resultArr : tempObj;
  }

  getRecipes(recipes) {
    let recipesList = recipes.reduce((recipesList, recipe) => {
      let tempRecipe = {};
      tempRecipe['ingredients'] = recipe.recipe.ingredientLines;
      tempRecipe['calories'] = recipe.recipe.calories;
      tempRecipe['nutrients'] = this.getNutrients(recipe.recipe.totalNutrients);
      tempRecipe['majorNutrients'] = this.majorNutrients(recipe.recipe.totalNutrients);
      tempRecipe['dailyNutrients'] = this.getNutrients(recipe.recipe.totalDaily);
      tempRecipe['image'] = recipe.recipe.image;
      tempRecipe['title'] = recipe.recipe.label;
      tempRecipe['recipieUrl'] = recipe.recipe.url;
      tempRecipe['dietLabels'] = recipe.recipe.dietLabels;
      tempRecipe['fav'] = false;
      recipesList.push(tempRecipe);
      return recipesList;
    }, []);
    this.RecipeObject = recipesList;
    this.getSortResults('ASC', 'High-Protein');
    return this.RecipeObject;
  }

  majorNutrients(nutrients) {
    const nutrientsList = {};
    Object.keys(nutrients).forEach(nutrientObj => {
      const tempObj = [];
      const nutrient = nutrients[nutrientObj];
      nutrientsList[nutrient['label']] = Number(nutrient['quantity'].toString()).toFixed(2);
    });
    return nutrientsList;
  }

  getNutrients(nutrients) {
    const nutrientsList = [];
    Object.keys(nutrients).forEach(nutrientObj => {
      const tempObj = [];
      const nutrient = nutrients[nutrientObj];
      tempObj.push(nutrient['label']);
      tempObj.push(Number(nutrient['quantity'].toString()).toFixed(2) + ' ' + nutrient['unit']);
      nutrientsList.push(tempObj);
    });
    return nutrientsList;
  }
  pollRecipeData(){
    var tempData = this.previousList;
      this.RecipeObject = tempData.slice(0,this.currentIndex);
      this.currentIndex += 10;
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { RouterModule, Routes } from '@angular/router';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { IngredientCheckDirective } from './directives/validators/ingredient-check.directive';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatSidenavModule, MatInputModule, MatDialogModule, MatCardModule} from "@angular/material";
import { SideNavComponent, SettingsComponent } from './side-nav/side-nav.component';
import {NutrientDialogTemplate, NutrientDialogComponent} from './nutrient-dialog/nutrient-dialog.component';

const appRoutes = [
  {path: '', redirectTo: 'recipeSearch/en', pathMatch: 'full'},
  {path : 'recipeSearch/:language', component: RecipeSearchComponent}
];
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'http://s3.us-east-2.amazonaws.com/locale-content/', '.json');
}
@NgModule({
  declarations: [
    AppComponent, SearchComponent,SettingsComponent, ViewRecipeComponent, RecipeSearchComponent, SideNavComponent, NutrientDialogComponent, NutrientDialogTemplate
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes, {useHash: true}
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
    Ng4LoadingSpinnerModule.forRoot(),
    NgbModule
  ],
  exports: [ViewRecipeComponent, SearchComponent, MatSidenavModule, MatInputModule, MatDialogModule,MatCardModule],
  entryComponents: [NutrientDialogTemplate, SettingsComponent],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

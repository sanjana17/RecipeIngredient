import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray, FormGroupDirective, NgForm} from '@angular/forms';
import {RecipeService} from '../recipe.service';
import {RecipeModel} from '../Models/recipeModel';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {IngredientCheckDirective} from '../directives/validators/ingredient-check.directive';
import {AppGlobal} from '../Content/AppGlobal';
import {TranslateService} from '@ngx-translate/core';
import {GoogleCloudVisionService} from '../services/google-cloud-vision.service';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';


import {ErrorStateMatcher} from '@angular/material/core';
import {environment} from '../../environments/environment';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid);
  }
}

interface Cuisine {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [AppGlobal, NgbTooltipConfig, GoogleCloudVisionService]
})
export class SearchComponent implements OnInit {
  @Output() sendRecipes = new EventEmitter<RecipeModel>();
@ViewChild('imageElement')
ie: ElementRef;
matcher: MyErrorStateMatcher;
  imageSearchData: any = [];
  recipes: RecipeModel = new RecipeModel({
    RecipeObject: []
  });
  selectable: Boolean = true;
  hideExclude: Boolean = true;
  voiceStarted: Boolean = false;
  removable: Boolean = true;
  inputs: String[]= ['0'];
  excludes: String;
  ingredients: String;
  alreadyTriggered: Boolean = false;
  public myForm: FormGroup;
  collapsed: Boolean = true;
  itemsGroup: FormArray;
  hideHeader: Boolean;
  constructor(private fb: FormBuilder,
              private recipeService: RecipeService,
              private spinnerService: Ng4LoadingSpinnerService,
              public appGlobal: AppGlobal,
              public translate: TranslateService,
              private vision: GoogleCloudVisionService,
              private ref: ChangeDetectorRef) { }

  cuisines: Cuisine[] = [
    {value: 'American', viewValue: 'American'},
    {value: 'Nordic', viewValue: 'Nordic'},
    {value: 'Caribbean', viewValue: 'Caribbean'},
    {value: 'Asian', viewValue: 'Asian'},
    {value: 'Kosher', viewValue: 'Kosher'},
    {value: 'South American', viewValue: 'South American'},
    {value: 'Eastern Europe', viewValue: 'Eastern Europe'},
    {value: 'Central Europe', viewValue: 'Central Europe'},
    {value: 'Middle Eastern', viewValue: 'Middle Eastern'},
    {value: 'British', viewValue: 'British'},
    {value: 'French', viewValue: 'French'},
    {value: 'Chinese', viewValue: 'Chinese'},
    {value: 'Japanese', viewValue: 'Japanese'},
    {value: 'Indian', viewValue: 'Indian'},
    {value: 'Italian', viewValue: 'Italian'},
    {value: 'Mediterranean', viewValue: 'Mediterranean'},
    {value: 'Mexican', viewValue: 'Mexican'}
  ];
  dishTypes: Cuisine[] = [
    {value: 'Bread', viewValue: 'Bread'},
    {value: 'Cereals', viewValue: 'Cereals'},
    {value: 'Condiments and sauces', viewValue: 'Condiments and sauces'},
    {value: 'Drinks', viewValue: 'Drinks'},
    {value: 'Desserts', viewValue: 'Desserts'},
    {value: 'Main course', viewValue: 'Main course'},
    {value: 'Pancake', viewValue: 'Pancake'},
    {value: 'Preps', viewValue: 'Preps'},
    {value: 'Preserve', viewValue: 'Preserve'},
    {value: 'Salad', viewValue: 'Salad'},
    {value: 'Sandwiches', viewValue: 'Sandwiches'},
    {value: 'Side dish', viewValue: 'Side dish'},
    {value: 'Soup', viewValue: 'Soup'},
    {value: 'Starter', viewValue: 'Starter'},
    {value: 'Sweets', viewValue: 'Sweets'}
  ];
  mealTypes: Cuisine[] = [
    {value: 'Breakfast', viewValue: 'Breakfast'},
    {value: 'Lunch', viewValue: 'Lunch'},
    {value: 'Snack', viewValue: 'Snack'},
    {value: 'Dinner', viewValue: 'Dinner'},
  ];

  ngOnInit() {
    const self = this;
    this.myForm = this.fb.group({
        'search': this.fb.array([this.createItem()]),
        'exclude': this.fb.array([this.createExcludeItem()]),
        'cuisineType': this.fb.control(null, null),
        'dishType': this.fb.control(null, null),
        'mealType': this.fb.control(null, null)
    });
    this.translate.setDefaultLang(this.appGlobal.defaultContent);
    // setInterval(() => {
    //   this.listenForSiri();
    // }, 2000);
  }
  listenForSiri() {
    // @ts-ignore
    const prefs = plugins.appPreferences;
    const suitePrefs = prefs.suite('group.recipesearch');

    suitePrefs.fetch(
      function(value) {
        // Activated by voice control
        console.log(value);
        if (value === 'openCamera') {
          // Clear the auto start
          suitePrefs.remove(function() {}, function() {}, 'start');
          this.searchPhoto(true);
        }
      }.bind(this),
      // Error
      function(error) {

      },
      'start'
    );
  }

  addSearchBox(): void {
    const inputLength = this.inputs.length;
    const lastIndex = Number(this.inputs[inputLength - 1]);
    if (lastIndex < 10) {
      this.itemsGroup = this.myForm.get('search') as FormArray;
      this.itemsGroup.push(this.createItem());
      this.inputs.push((lastIndex + 1).toString());
    }
  }
  addExclude(): void {
    this.hideExclude = false;
    const inputLength = this.inputs.length;
    const lastIndex = Number(this.inputs[inputLength - 1]);
    console.log(lastIndex);
    if (lastIndex < 10) {
      this.itemsGroup = this.myForm.get('exclude') as FormArray;
      this.itemsGroup.push(this.createExcludeItem());
      this.inputs.push((lastIndex + 1).toString());
    }
  }
  searchPhoto(fromEvent) {
    const self = this;
    if (fromEvent) {
        self.ie.nativeElement.click();
    } else {
        self.spinnerService.show();
        const fileCount: number = self.ie.nativeElement.files.length;
        const formData = new FormData();
        if (fileCount > 0) {
          const base64 = new FileReader();
          let res;
          base64.readAsBinaryString(self.ie.nativeElement.files[0]);
          setTimeout(() => {
            const str = base64.result;
            res = btoa(str);
            self.vision.getLabels(res).subscribe(resp => {
              self.imageSearchData = resp.responses[0].labelAnnotations;
              self.ref.detectChanges();
              self.spinnerService.hide();
            });
          }, 5000);
        }
    }
  }
  addIngredient(description) {
    this.itemsGroup = this.myForm.get('search') as FormArray;
    console.log(this.itemsGroup);
    let descript =  this.itemsGroup.value[0].name;
    descript += description + ',';
    this.itemsGroup.controls[0].setValue({'name': descript});
  }

  addExcludeIngredient(description) {
    this.itemsGroup = this.myForm.get('search') as FormArray;
    console.log(this.itemsGroup);
    let descript =  this.itemsGroup.value[0].name;
    descript += description + ',';
    this.itemsGroup.controls[0].setValue({'name': descript});
  }

  private createItem() {
    return this.fb.group({
      name: ['', Validators.compose([IngredientCheckDirective(/[^a-zA-Z, ]/g)])]
    });
  }
  private createExcludeItem() {
    return this.fb.group({
      excludeName: ['', Validators.compose([IngredientCheckDirective(/[^a-zA-Z, ]/g)])]
    });
  }

  search() {
    const values = this.myForm;
    this.ingredients = '';
    const ingredients = this.myForm.controls.search.value.reduce(((ingredientsArr, value) => {
      ingredientsArr.push(value.name);
        return ingredientsArr;
    }), []);
    const excludeIngredients = this.myForm.controls.exclude.value.reduce(((excludes, value) => {
      excludes.push(value.excludeName);
        return excludes;
    }), []);
    this.excludes = excludeIngredients.length > 0 ? '&excluded=' + excludeIngredients.join('&excluded=') : '';
console.log(this.excludes)
    ingredients.push(this.myForm.controls.cuisineType.value);
    ingredients.push(this.myForm.controls.mealType.value);
    ingredients.push(this.myForm.controls.dishType.value);
    this.ingredients = ingredients.concat(',');
    this.recipeService.getRecipe(this.ingredients, this.excludes).subscribe(result => {
      this.spinnerService.hide();
      const count = result['count'] || 0;
      this.imageSearchData = [];
      const recipes = this.recipes.getRecipes(result['hits']);
      this.sendRecipes.emit(new RecipeModel({
        RecipeObject: recipes,
        count: count,
        originalList: result,
        currentSearchQuery: this.ingredients
      }));
    });
  }

  removeSearchBox(index) {
    if (index > 0) {
      this.itemsGroup = this.myForm.get('search') as FormArray;
      this.itemsGroup.removeAt(index);
      this.inputs.pop();
      if (this.itemsGroup.length < 5 && this.collapsed) {
        this.collapsed = false;
      }
    }
  }
  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  clearSearchBoxes(name) {
    this.itemsGroup = this.myForm.get(name) as FormArray;
    for (let i = this.itemsGroup.length  ; i > 0; i--) {
       this.itemsGroup.removeAt(i);
    }
    if (name === 'search') {
      this.itemsGroup.controls[0].setValue({'name': ''});
    }else {
      this.itemsGroup.controls[0].setValue({'excludeName': ''});
    }
  }
  getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window['opera'];

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    // @ts-ignore
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }

    return 'unknown';
  }
  enableSpeech() {
    const flag = environment.production;
    if (!flag) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();

      const utterThis = new SpeechSynthesisUtterance('please say the ingredient');
      utterThis.voice = voices[10];
      synth.speak(utterThis);
      utterThis.onend = (evt) => {
        const recognition = new (window['SpeechRecognition'] || window['webkitSpeechRecognition'] || window['mozSpeechRecognition'] || window['msSpeechRecognition'])();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.start();
        this.voiceStarted = true;

        recognition.onresult = function (event) {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            transcript.split(' ').forEach(elem => {
              this.imageSearchData.push({description: elem, score: 100});
              this.voiceStarted = false;
            });
          } else {
            this.voiceStarted = false;
          }
        }.bind(this);
      };
    } else {
      //const url = environment.fileUrl[this.getMobileOperatingSystem()];
      // @ts-ignore
      const my_media = new Media(url,
        // success callback
        function () {
          console.log(' playAudio():Audio Success');
        },
        // error callback
        function (err) {
          console.log('playAudio():Audio Error: ' + err);
        }
      );
      my_media.startRecord();
      this.voiceStarted = true;
      setTimeout(() => {
        this.voiceStarted = false;
        my_media.stopRecord();
      }, 3000);
    }
  }
}

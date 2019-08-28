import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrientDialogComponent } from './nutrient-dialog.component';

describe('NutrientDialogComponent', () => {
  let component: NutrientDialogComponent;
  let fixture: ComponentFixture<NutrientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutrientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutrientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

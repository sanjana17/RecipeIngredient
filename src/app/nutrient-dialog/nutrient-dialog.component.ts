import {Component, Input, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-nutrient-dialog',
  templateUrl: './nutrient-dialog.component.html',
  styleUrls: ['./nutrient-dialog.component.css']
})
export class NutrientDialogComponent implements OnInit {
  @Input() nutrients;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(NutrientDialogTemplate, {
      width: '200em',
     data: {nutrient: this.nutrients}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

@Component({
  selector: 'app-nutrient-dialog-template',
  templateUrl: 'app-nutrient-dialog-template.html',
})
export class NutrientDialogTemplate {

  constructor(
    public dialogRef: MatDialogRef<NutrientDialogTemplate>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


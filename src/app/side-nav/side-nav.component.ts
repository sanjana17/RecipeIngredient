import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import * as crypto from 'crypto-js';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {AuthService} from "./auth.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
  providers: [AuthService]
})
export class SideNavComponent implements OnInit {
  userEmail: String;
  loginActive: Boolean;
  constructor(public  translate: TranslateService, public dialog: MatDialog, private auth: AuthService, private spinnerService :Ng4LoadingSpinnerService) {
    console.log(this.translate.getLangs());
  }

  ngOnInit() {

  }

  signOut(){
    this.spinnerService.show();
      this.auth.signOut().then(res => {
        this.loginActive = false;
        this.userEmail = '';
        localStorage.removeItem('token');
        this.spinnerService.hide();
      });
  }

  login(){
    let dialogRef = this.dialog.open(LoginComponent, {
      width: '50em',
      data: {
        authLabel: 'Login'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.login){
          this.userEmail = result.email;
          this.loginActive = true;
      }
    });
  }
  register(){
    let dialogRef = this.dialog.open(LoginComponent, {
      width: '50em',
      data: {
        authLabel: 'Register'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.login){
        this.userEmail = result.email;
        this.loginActive = true;
      }
    });
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(SettingsComponent, {
      width: '50em'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

@Component({
  selector: 'app-settings',
  templateUrl: 'app-settings.html',
})
export class SettingsComponent {

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrls: ['./side-nav.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit{
  myForm: FormGroup;
  authLabel: String;
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService:AuthService,
    private spinnerService :Ng4LoadingSpinnerService) {
    this.authLabel = data.authLabel;
  }
  ngOnInit(){
    this.myForm =  this.fb.group({
      'login': ['', Validators.compose([Validators.email, Validators.required])],
      'password': ['', Validators.required]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onLoginClick(authLabel){
    this.spinnerService.show();
    const loginPassword = this.myForm.value.login +"-"+ this.myForm.value.password;
    let auth;
    let error: String;
    if(authLabel === 'Login'){
     auth = this.authService.loginWithEmail(this.myForm.value.login,this.myForm.value.password).then(res => {
        localStorage.setItem('token',res);
        this.dialogRef.close({ login: true, email: this.myForm.value.login});
       this.spinnerService.hide();
     }).catch(err => {
        error = err.message;
     });
    }
    else{
       auth = this.authService.registerWithEmail(this.myForm.value.login,this.myForm.value.password).then(res => {
         localStorage.setItem('token',res);
         this.dialogRef.close({ login: true, email: this.myForm.value.login});
         this.spinnerService.hide();
       }).catch(err => {
         error = err.message;
       });
    }
    console.log(auth);
  }


}

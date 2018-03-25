
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;
  }

  loginWithEmail(email,password){
    return this._firebaseAuth.auth.signInWithEmailAndPassword(email,password);
  }
  registerWithEmail(email,password){
    return this._firebaseAuth.auth.createUserWithEmailAndPassword(email,password);
  }
  signOut(){
    return this._firebaseAuth.auth.signOut();
  }
}

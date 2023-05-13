import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private tostr: ToastrService
  ) {}

  // signup:

  signup(email: string, password: string, name: string, about: string) {
    this.fireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        //varify email
        this.sendVarificationLink();
        this.setUser(result.user, name, about).then((data) => {
          console.log(data);
          this.tostr.success('User is registered !!');
          this.setUserToLocalStorage(result.user);
        });
      })
      .catch((error) => {
        console.log(error);
        alert('error in signup');
      });
  }

  setUser(user: any, name: string, about: string) {
    console.log(user);

    const userListRef: AngularFireObject<User> = this.db.object(
      `users/${user.uid}`
    );
    const user1: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      imageUrl: user.photoURL,
      emailVerified: user.emailVerified,
      name: name,
      about: about,
    };

    return userListRef.set(user1);
  }

  //send the varification link
  sendVarificationLink() {
    return this.fireAuth.currentUser.then((data) => {
      data?.sendEmailVerification().then(() => {
        this.tostr.success('Verification link is send on you email');
      });
    });
  }

  //sign out
  logout() {
    this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }

  //
  setUserToLocalStorage(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // login
  login(email: string, password: string) {
    return this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.tostr.success('Login success');
        this.setUserToLocalStorage(result.user);
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.tostr.error('Error in signin');
        this.tostr.error(error);
        console.log(error);
      });
  }

  // forgot password
  forgotPassword(email: string) {
    return this.fireAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        alert('email send');
      })
      .catch(() => {
        alert('error in sending email');
      });
  }

  get isLoggedIn(): boolean {
    const userString = localStorage.getItem('user');
    // console.log(userString);

    if (userString) {
      return JSON.parse(userString);
    } else {
      return false;
    }
  }

  authLogin(provider: any) {
    return this.fireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
      })
      .catch((error) => {
        console.log(error);
        alert('error');
      });
  }
}

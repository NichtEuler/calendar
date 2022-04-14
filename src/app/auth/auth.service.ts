import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthData } from './auth.data.model';
import { Subject } from 'rxjs';

import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private username: string;


  constructor(private httpClient: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuthed() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, username: string, password: string) {
    const authData: AuthData = { email: email, username: username, password: password };
    this.httpClient.post(BACKEND_URL + "signup", authData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      },
        error => {
          this.authStatusListener.next(false);
        });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, username: null, password: password };
    this.httpClient.post<{ token: string, expiresIn: number, userId: string, username: string }>(BACKEND_URL + "login", authData)
      .subscribe(response => {
        console.log(response);

        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthtimer(expiresInDuration);
          this.userId = response.userId;
          console.log(this.userId);

          this.username = response.username;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const date = new Date();
          const expirationDate = new Date(date.getTime() + expiresInDuration * 1000);

          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(["/"]);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthtimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("date", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("date");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("date");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
  private setAuthtimer(duration: number) {
    this.tokenTimer = setTimeout(() => { this.logout(); }, duration * 1000);
  }
}


import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { api } from "./../app.config";
import { User } from "./user.model";
import { Buffer } from "node:buffer";

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  // Http
  signupUser(user: User) {
    return this.http.post(api.baseUrl + '/auth/register', user, this.noAuthHeader);
  }

  login(authCredentials: any) {
    return this.http.post(api.baseUrl + '/auth/login', authCredentials, this.noAuthHeader);
  }

  getProfile(email: any) {
    console.log(email);
    return this.http.get(api.baseUrl + `/auth/profile/${email}`);
    // return this.http.get(api.baseUrl + '/auth/profile', authCredentials);
  }

  // Token Helpers
  setToken(token : string) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  deleteToken() {
    localStorage.removeItem('token');
  }

  // Email Helpers
  setEmail(email: string) {
    localStorage.setItem('userEmail', email);
  }
  getEmail() {
    return localStorage.getItem('userEmail');
  }
  deleteEmail() {
    localStorage.removeItem('userEmail');
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      // const userPayload = Buffer.from(token.split('.')[1], 'utf-8').toString();
      // Buffer.from(token.split('.')[1], 'utf-8')
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }


}
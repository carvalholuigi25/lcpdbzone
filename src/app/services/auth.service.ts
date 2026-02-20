import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs';
import { AuthResponse, AuthUserForgotPassModel, AuthUserRegModel, LoginRequest, RefreshTokenRequest } from '@/app/models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isSSL: boolean = false;
  private apiURL: string = this.getAPIURL();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
  }

  private getAPIURL() {
    return `http${this.isSSL ? 's' : ''}://localhost:${this.isSSL ? '5000': '5001'}`;
  }

  private storeTokens(res: AuthResponse) {
    localStorage.setItem('accessToken', ""+res.jwtToken);
    localStorage.setItem('refreshToken', ""+res.jwtToken);
  }

  login(data: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${this.apiURL}/auth/authenticate`, data)
      .pipe(tap((res) => this.storeTokens(res)));
  }

  register(data: AuthUserRegModel) {
    return this.http.post<AuthUserRegModel>(`${this.apiURL}/api/users`, data);
  }

  forgotPass(data: AuthUserForgotPassModel) {
    return this.http.put<AuthUserForgotPassModel>(`${this.apiURL}/api/users`, data);
  }

  refreshToken() {
    const payload: RefreshTokenRequest = {
        accessToken: this.getAccessToken()!,
        refreshToken: this.getRefreshToken()!
    };

    return this.http.post<AuthResponse>(`${this.apiURL}/auth/refresh-token`, payload);
  }

  logout() {
    localStorage.clear();
  }

  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('login');
  }

  isAdmin(): boolean | string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('login') && JSON.parse(localStorage.getItem("login")!).role == "admin";
  }

  isUser(): boolean | string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('login') && JSON.parse(localStorage.getItem("login")!).role == "user";
  }

  isUserIdDoesMatch(id: number = 1): boolean | string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('login') && JSON.parse(localStorage.getItem("login")!).id === id;
  }

  isUserIdDoesNotMatch(id: number = 1): boolean | string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('login') && JSON.parse(localStorage.getItem("login")!).id !== id;
  }

  getUserId(): boolean | string | null {
    if (!isPlatformBrowser(this.platformId)) {  
      return null;
    }  
    
    return localStorage.getItem('login') && JSON.parse(localStorage.getItem("login")!).id;
  }

  destroy(): void {
    // Cleanup if necessary
    this.http = null!;
  }
}

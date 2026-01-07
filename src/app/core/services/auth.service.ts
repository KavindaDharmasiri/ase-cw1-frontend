import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${environment.endpoints.auth.login}`, credentials)
      .pipe(tap(response => {
        console.log('Login response:', response);
        this.setToken(response.token);
        localStorage.setItem('user_role', response.role);
        localStorage.setItem('user_info', JSON.stringify(response));
        console.log('Stored role:', localStorage.getItem('user_role'));
        console.log('Stored token:', localStorage.getItem(this.tokenKey));
      }));
  }

  validateToken(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${environment.endpoints.auth.validate}`)
      .pipe(
        catchError(error => {
          console.log('Token validation failed:', error);
          this.logout();
          this.router.navigate(['/login']);
          return of(null);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.endpoints.auth.register}`, userData, { responseType: 'text' });
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('isAuthenticated - token exists:', !!token);
    if (token) {
      this.validateToken().subscribe();
    }
    return !!token;
  }

  getUserRole(): string | null {
    const role = localStorage.getItem('user_role');
    console.log('getUserRole - stored role:', role);
    return role;
  }

  getUsername(): string | null {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.username || user.fullName || 'User';
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_info');
  }
}
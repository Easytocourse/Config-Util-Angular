import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'http://localhost:7070/api/auth';
  private isLoggedIn = false;
  private tokenKey = 'auth-token';
  constructor(private http: HttpClient, private router: Router) {}

  loginnew(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials).pipe(
      tap((response: any) => {
        // Assuming the token is in the response body
        this.setToken(response.token);
      })
    );
  }

  signup(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, credentials);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticatednew(): boolean {
    return this.getToken() !== null;
  }
  logoutnew(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
  login(email: string, password: string): boolean {
    // Replace this with real authentication logic
    if (email === 'admin@example.com' && password === 'password') {
    this.isLoggedIn = true;
    localStorage.setItem('loggedIn', 'true');
    return true;
    }
    else{
      return false;
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('loggedIn');
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  isAuthenticated(): boolean {
    return this.isLoggedIn || localStorage.getItem('loggedIn') === 'true';
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.roles.includes('ROLE_ADMIN');
  }
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

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

  isAuthenticated(): boolean {
    return this.isLoggedIn || localStorage.getItem('loggedIn') === 'true';
  }
}
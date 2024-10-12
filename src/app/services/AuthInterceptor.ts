import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService,private router:Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const existingAuthHeader = req.headers.get('Authorization');
    let headers = req.headers;
    if (existingAuthHeader) {
      // If there's an existing Authorization header, preserve it
      headers = headers.set('Authorization', existingAuthHeader);
    } else if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status ===403) {
          this.authService.logoutnew();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}

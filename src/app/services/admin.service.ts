import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:7070/api/admin';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  updateUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
}

export interface User {
  id: number;
  username: string;
  role: string;
}

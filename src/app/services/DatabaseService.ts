// database.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'http://localhost:7070/api/databases';

  constructor(private http: HttpClient) {}

  getDbInfo(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/info`, details);
  }

  clearschema(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clear-schema`, details);
  }
}

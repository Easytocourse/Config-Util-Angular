import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../models/machine';
@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private apiUrl = 'http://localhost:7070/api/machines';

  constructor(private http: HttpClient) { }
  cache: any = null;
  getMachineById(machineId: number): Observable<Machine> {
    const url = `${this.apiUrl}/${machineId}`;
    return this.http.get<Machine>(url);
  }

  updateMachine(id:Number,machine: Machine): Observable<Machine> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Machine>(url, machine);
  }

  saveMachine(machine: Machine): Observable<Machine> {
    const url = `${this.apiUrl}`;
    return this.http.post<Machine>(url, machine);
  }
  checkStatus(ipAddress: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/checkStatus`, { params: { ipAddress }, responseType: 'text' });
  }
  

}

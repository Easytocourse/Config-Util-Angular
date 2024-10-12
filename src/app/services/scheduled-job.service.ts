import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduledJob } from '../components/scheduled-jobs-dialog/scheduled-jobs-dialog.component'; 

@Injectable({
  providedIn: 'root'
})
export class ScheduledJobService {

  constructor(private http: HttpClient) {}

  // Fetch all scheduled jobs
  getScheduledJobs(apiUrl: string, headers: HttpHeaders): Observable<ScheduledJob[]> {
    return this.http.get<ScheduledJob[]>(apiUrl,{ headers: headers});
  }

  // Cancel a scheduled job by ID
  cancelJob(apiUrl: string,jobId: number): Observable<any> {
    return this.http.delete(`${apiUrl}/${jobId}`);
  }

  deleteJob(apiUrl:string,id: any,headers: HttpHeaders) : Observable<any>{
    return this.http.delete(`${apiUrl}/${id}`,{ headers: headers});
  }

  updateJob(id: any, updatedJob: any): Observable<any> {
    
    return id;
  }

  // getJobStatus(apiUrl:string,jobId: string,headers: HttpHeaders): Observable<string> {
  //   return new Observable<string>(observer => {
  //     const eventSource = new EventSource(`${apiUrl}/${jobId}`,{ headers: headers});
      
  //     eventSource.onmessage = event => observer.next(event.data);
  //     eventSource.onerror = error => observer.error(error);
  //     eventSource.onopen = () => console.log('Connection opened');

  //     // Clean up when observable is unsubscribed
  //     return () => eventSource.close();
  //   });
  // }

  streamFile(apiUrl:string,jobId: string,headers: HttpHeaders): Observable<Blob> {
    return this.http.get(`${apiUrl}/${jobId}`, {
      responseType: 'blob',
      headers:headers
    });
  }

}

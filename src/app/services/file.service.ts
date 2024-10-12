import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  // Endpoint to read a file from the server
  readFile(apiUrl:string,filepath: string, headers: HttpHeaders): Observable<Object> {

    return this.http.get(`${apiUrl}`, {
      params: { path: filepath },
      headers,
      responseType: 'text' as 'json' 
    });
  }

  // Endpoint to upload a file to the server
  uploadFile(apiUrl:string,file: File, folderpath: string,headers: HttpHeaders): Observable<Object> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderpath', folderpath);

    return this.http.post<string>(`${apiUrl}`,formData, { headers: headers,responseType: 'text' as 'json'  });
  }

  // Endpoint to get a sample .bat file
  getSampleBatFile(apiUrl: string, headers: HttpHeaders): Observable<Blob> {
    console.log('bharath'+apiUrl);
    return this.http.get(`${apiUrl}`, {
      headers,
      responseType: 'blob' // Expecting a binary response
    });
  }

    // Endpoint to get a sample .bat file
    uploadAndSchedule(apiUrl: string, formData: FormData, headers: HttpHeaders): Observable<Object> {
      return this.http.post(`${apiUrl}`, formData, { headers: headers, responseType: 'text' as 'json'  });
    }
}

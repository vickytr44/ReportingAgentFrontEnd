import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private apiUrl = 'http://127.0.0.1:8000/'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  generateReport(payload: any): Observable<Blob> {
    return this.http.post(this.apiUrl + 'generate-report', payload, {
      responseType: 'blob', // Expecting binary data
    });
  }

  generateBarGraph(payload: any): Observable<Blob> {
    return this.http.post(this.apiUrl + 'bar-chart', payload, {
      responseType: 'blob', // Expecting binary data
    });
  }
}

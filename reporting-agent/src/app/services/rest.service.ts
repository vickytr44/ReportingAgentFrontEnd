import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private apiUrl = 'http://127.0.0.1:8000/generate-report'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  generateReport(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}

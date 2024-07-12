import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TotalQuantity } from '../dtos/Line.dashboard.dto';

@Injectable({
  providedIn: 'root'
})
export class LineDashboardService {

  private baseUrl = 'http://localhost:3000/api/line-dashboard';  // Update this to your server's address

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getTotalQuantity(filters: any): Observable<TotalQuantity> {
    return this.http.post<TotalQuantity>(`${this.baseUrl}/total-quantity`, filters, this.httpOptions);
  }

  getBoxCount(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/box-count`, filters, this.httpOptions);
  }

  getAverageQuantity(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/average-quantity`, filters, this.httpOptions);
  }

  getCountByCodeFournisseur(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sum-by-code-fournisseur`, filters, this.httpOptions);
  }

  getCountOfPackageByHour(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/count-by-hour`, filters, this.httpOptions);
  }

  getCountByOperator(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/count-by-operator`, filters, this.httpOptions);
  }

  getHourlyQuantity(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/hourly-quantity`, filters, this.httpOptions);
  }

  getQuantityByHour(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/quantity-by-hour`, filters, this.httpOptions);
  }


  getHourProduitsDTO(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/productive-hours`, filters, this.httpOptions);
  }

  getCurrentQuantity(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/total-quantity-current`, filters, this.httpOptions);
  }
}

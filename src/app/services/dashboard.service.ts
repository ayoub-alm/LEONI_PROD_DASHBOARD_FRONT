import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { routes } from "../app.routes";
import { BoxCount, CountDto, CountHourDto } from "../dtos/box.count";

@Injectable({
    providedIn:'root'
})
export class DashboardService{
    constructor(private http: HttpClient){}
    private baseUrl = "http://localhost:3000"


    /**
     * 
     * @returns {BoxCount} List Of Box Coun 
     */
    getCountOfBoxPerRef(): Observable<BoxCount[]>{
        return this.http.get<BoxCount[]>(`${this.baseUrl}/api/count-of-box-by-ref`)
    }

    /**
     * 
     * @returns {BoxCount} List Of Box Coun 
     */
    getCountOfFxPerRef(): Observable<BoxCount[]>{
        return this.http.get<BoxCount[]>(`${this.baseUrl}/api/count-of-fx-by-ref`)
    }


    getCountOfbox():Observable<CountDto>{
        return this.http.get<CountDto>(`${this.baseUrl}/api/count-of-boxs`).pipe(
            tap(value => new CountDto(value.total_quantity))
        )
    }


    getCountOfFx():Observable<CountDto>{
        return this.http.get<CountDto>(`${this.baseUrl}/api/count-of-fx`)
    }



  getDataWithFilter(filters: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/data-with-filter`, filters);
  }


  getFxPerHourInShift(): Observable<CountHourDto[]> {
    return this.http.get<CountHourDto[]>(`${this.baseUrl}/api/fx-per-hour-in-shift`);
  }
    
}
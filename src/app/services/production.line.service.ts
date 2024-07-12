import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductionLineModel } from "../models/production.line.model";

@Injectable({
    providedIn:'root'
})
export class  ProductionLineService{
    private baseUrl = "http://localhost:3000";
  
    constructor(private http: HttpClient) {}
    
    /**
     * This function allows us to get a list of projects 
     * @returns {ProductionLineModel[]} list of project 
     */
    getAllLines(): Observable<ProductionLineModel[]> {
      return this.http.get<ProductionLineModel[]>(`${this.baseUrl}/api/production-lines`);
    }
}
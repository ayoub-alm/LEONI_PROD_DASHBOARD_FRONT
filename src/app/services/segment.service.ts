import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SegmntModel } from "../models/segmentModel";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class SegmentService{
    private baseUrl = "http://localhost:3000";
  
    constructor(private http: HttpClient) {}
    
    /**
     * This function allows us to get a list of projects 
     * @returns {SegmntModel[]} list of project 
     */
    getAllSegments(): Observable<SegmntModel[]> {
      return this.http.get<SegmntModel[]>(`${this.baseUrl}/api/segments`).pipe()
    }
}
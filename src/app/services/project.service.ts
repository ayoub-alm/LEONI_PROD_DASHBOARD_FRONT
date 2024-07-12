import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProjectModel } from "../models/project.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = "http://localhost:3000";
  
  constructor(private http: HttpClient) {}
  
  /**
   * This function allows us to get a list of projects 
   * @returns {ProjectModel[]} list of project 
   */
  getAllProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.baseUrl}/api/projects`);
  }
}

import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import Chart from 'chart.js/auto';
import {MatCardModule} from "@angular/material/card";
import {BehaviorSubject, Observable, concat, concatMap, take, tap} from "rxjs";
import {RouterOutlet} from "@angular/router";
import { DashboardService } from '../services/dashboard.service';
import { BoxCount, CountDto, CountHourDto } from '../dtos/box.count';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../models/project.model';
import { SegmentService } from '../services/segment.service';
import { SegmntModel } from '../models/segmentModel';
import { ProductionLineService } from '../services/production.line.service';
import { ProductionLineModel } from '../models/production.line.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-line-charts',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatCardModule,ReactiveFormsModule,
    RouterOutlet, CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent  implements OnInit{
  boxPerRef:BehaviorSubject<BoxCount[]> = new BehaviorSubject<BoxCount[]>([])
  sumFxPerRef:BehaviorSubject<BoxCount[]> = new BehaviorSubject<BoxCount[]>([])
  countOfFx:BehaviorSubject<CountDto> = new BehaviorSubject<CountDto>({total_quantity:0})
  countOfbox:BehaviorSubject<CountDto> = new BehaviorSubject<CountDto>({total_quantity:0})
  projects:BehaviorSubject<ProjectModel[]> = new BehaviorSubject<ProjectModel[]>([])
  allSegements: SegmntModel[]= [];
  segments: BehaviorSubject<SegmntModel[]> = new BehaviorSubject<SegmntModel[]>([])
  productionLines: BehaviorSubject<ProductionLineModel[]> =  new BehaviorSubject<ProductionLineModel[]>([])
  allProductionLine: ProductionLineModel[] = []
  countFxPerHoure: CountHourDto[] =[];
  filterForm: FormGroup =  this.formBuilder.group({
    project:["",Validators.required],
    line:[""],
    segment:[""],
    from: [this.formatDate(new Date()), Validators.required],
    to: [this.formatDate(new Date()), Validators.required]
  });

  constructor(private dashboardService: DashboardService, private projectService: ProjectService, private segmentService: SegmentService,
    private productionLineService: ProductionLineService,   private formBuilder: FormBuilder,
  ) {  }
/**
 * 
 */
  ngOnInit() {
    this.setDefaultDates()
    this.getInitData()

    this.projectService.getAllProjects().pipe(
      tap((projects) =>{
        this.projects.next(projects)
      })
    ).subscribe()

    this.segmentService.getAllSegments().pipe(
      tap((segements) => {
        this.allSegements = segements;
        this.segments.next(segements)
      })
    ).subscribe()

    this.productionLineService.getAllLines().pipe(
      tap((productionLines) =>{
        this.allProductionLine = productionLines;
        this.productionLines.next(productionLines)
      })
    ).subscribe()
    // list to change in project select box 
    this.filterForm.get('project')?.valueChanges.subscribe(value => {
      let filtredSegments = this.allSegements;
      this.segments.next(filtredSegments.filter(sgm => { return  sgm.project_id == value}))
      let filtredLines = this.allProductionLine;
      this.productionLines.next(filtredLines.filter(line => { return  line.segment.project_id == value}))
    })
    // listen to changes in segement 
    this.filterForm.get('segment')?.valueChanges.subscribe(value => {
      let filtredLines = this.allProductionLine;
      this.productionLines.next(filtredLines.filter(line => { return  line.segment.id == value}))
    })

  }


  setDefaultDates() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    
    let fromDate: Date;
    let toDate: Date;
    
    if (currentHour >= 22 || currentHour < 6) {
      // Shift C
      fromDate = new Date(currentDate);
      fromDate.setHours(22, 0, 0, 0);
      toDate = new Date(currentDate);
      if (currentHour < 6) {
        fromDate.setDate(fromDate.getDate() - 1); // Previous day 22:00
      } else {
        toDate.setDate(toDate.getDate() + 1); // Next day 06:00
      }
      toDate.setHours(6, 0, 0, 0);
    } else if (currentHour >= 6 && currentHour < 14) {
      // Shift A
      fromDate = new Date(currentDate);
      fromDate.setHours(6, 0, 0, 0);
      toDate = new Date(currentDate);
      toDate.setHours(14, 0, 0, 0);
    } else {
      // Shift B
      fromDate = new Date(currentDate);
      fromDate.setHours(14, 0, 0, 0);
      toDate = new Date(currentDate);
      toDate.setHours(22, 0, 0, 0);
    }
  
    this.filterForm.patchValue({
      project:"",
      line:"",
      segment:"",
      from: this.formatDate(fromDate),
      to: this.formatDate(toDate),
      // shift: this.getCurrentShift(currentHour)
    });
  }



  /**
   * this function allows to init charts
   */
  getInitData():void {
    let filters =  {
      project: this.filterForm.get('project')?.value,
      segment: this.filterForm.get('segment')?.value,
      line: this.filterForm.get('line')?.value,
      from: this.formatDate(this.filterForm.get('from')?.value),
      to: this.formatDate(this.filterForm.get('to')?.value),
    }

    this.dashboardService.getTotalQuantity(filters).pipe(
      tap((value) =>{ console.log(value)})
    ).subscribe();
    

  }

  onFilter() {
    this.getInitData();
    // this.updateCharts();
  }


  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
  
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

}
  
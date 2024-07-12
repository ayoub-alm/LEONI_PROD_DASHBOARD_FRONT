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
    from:[""],
    to:[""],
  });

  constructor(private dashboardService: DashboardService, private projectService: ProjectService, private segmentService: SegmentService,
    private productionLineService: ProductionLineService,   private formBuilder: FormBuilder,
  ) {  }
/**
 * 
 */
  ngOnInit() {
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
      alert(value)
      let filtredLines = this.allProductionLine;
      this.productionLines.next(filtredLines.filter(line => { return  line.segment.id == value}))
    })

    //get count per houre 
    this.dashboardService.getFxPerHourInShift().pipe(
      tap((value)=> {
          this.countFxPerHoure = value
      })
    ).subscribe((value)=> {
      this.initCoutPerHourChart()
    } )
  }




  /**
   * this function allows to init charts
   */
  getInitData():void {
    this.dashboardService.getCountOfFxPerRef().pipe(
      tap((counts) =>{
        this.sumFxPerRef.next(counts)
      })
    ).subscribe(response => {
      this.dashboardService.getCountOfBoxPerRef().pipe(
        tap((counts) =>{
          this.boxPerRef.next(counts)
          this.initializeCharts();
        }),
      ).subscribe()
    })

    this.dashboardService.getCountOfFx().pipe(
      tap((total) => {
        this.countOfFx.next(total)
      })
    ).subscribe()

    this.dashboardService.getCountOfbox().pipe(
      tap((total) => {
        this.countOfbox.next(total)
      })
    ).subscribe()
  }

getDataWithFilter(){
  let filters =  {
    project: this.filterForm.get('project')?.value,
    segment: this.filterForm.get('segment')?.value,
    line: this.filterForm.get('line')?.value,
    from: this.formatDate(this.filterForm.get('from')?.value),
    to: this.formatDate(this.filterForm.get('to')?.value),
  }
  console.log(filters);

  this.dashboardService.getDataWithFilter(filters).subscribe(value => console.log(value));

  
}

  
initializeCharts() {
    // Harness per hour chart
    const ctx1 = document.getElementById('harnessPerHourChart') as HTMLCanvasElement;
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: this.boxPerRef.getValue().map(box => box.Code_fournisseur),
        datasets: [{
          label: 'Count of packages per Ref',
          data: this.boxPerRef.getValue().map(box => box.box_count),
          borderColor: "#ff7514",
          backgroundColor : "#ff7514"
        }]
      },
      options: {

        maintainAspectRatio: false,
        indexAxis: 'y',
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });

    // Progress chart
    const ctx2 = document.getElementById('progressChart') as HTMLCanvasElement;
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: this.sumFxPerRef.getValue().map(box => box.Code_fournisseur),
        datasets: [{
          label: 'Progress',
          data: this.sumFxPerRef.getValue().map(box => box.box_count),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

  }




  initCoutPerHourChart():void{
    const ctx3 = document.getElementById('myChart2') as HTMLCanvasElement;
    const labels = this.countFxPerHoure.map(value => value.hour);
    new Chart(ctx3, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Harness per hour',
          data: this.countFxPerHoure.map(value => value.hour),
          fill: false,
          borderColor: 'rgb(255, 165, 0)', // Orange color
          backgroundColor: 'rgb(0,128,255)', // Blue color for points
          tension: 0.1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'progress'
          }
        }
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

}
  
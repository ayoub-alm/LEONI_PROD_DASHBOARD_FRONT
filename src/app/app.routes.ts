import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { LineDashboardComponent } from './line-dashboard/line-dashboard.component';
import { LineDisplayComponent } from './line-display/line-display.component';



export const routes: Routes = [
  {path:'', component: IndexComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'index', component: IndexComponent},
  {path:'line-dashboard', component: LineDashboardComponent},
  {path:'line-display', component: LineDisplayComponent},
];

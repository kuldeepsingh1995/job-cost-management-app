import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetSubmissionsComponent } from './timesheet-submissions/timesheet-submissions.component';
import { TimesheetSubmissionsEmpComponent } from './timesheet-submissions-emp/timesheet-submissions-emp.component';

import { TimesheetViewComponent } from './timesheet-view/timesheet-view.component';
import { ReportComponent } from './report/report.component';


const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'timesheet-view/:key', component: TimesheetViewComponent
      },
      {
        path: 'timesheet/:key', component: TimesheetComponent
      },
      {
        path: 'timesheet', component: TimesheetComponent
      },
      {
        path: 'timesheet-submissions', component: TimesheetSubmissionsComponent
      },
      {
        path: 'report', component: ReportComponent
      },
      {
        path: 'timesheet-submissions-emp', component: TimesheetSubmissionsEmpComponent
      },
      {
        path: 'users',  loadChildren: () => import('./provider/provider.module').then(mod => mod.ProviderModule),
      },
     
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

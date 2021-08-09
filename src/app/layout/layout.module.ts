import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetSubmissionsComponent } from './timesheet-submissions/timesheet-submissions.component';
import { TimesheetSubmissionsEmpComponent } from './timesheet-submissions-emp/timesheet-submissions-emp.component';
import { TimesheetViewComponent } from './timesheet-view/timesheet-view.component';
import { ReportComponent } from './report/report.component';



@NgModule({
  declarations: [ReportComponent ,TimesheetViewComponent, DashboardComponent, LayoutComponent, TimesheetComponent, TimesheetSubmissionsComponent, TimesheetSubmissionsEmpComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
   ]
})
export class LayoutModule { 
  constructor(){

  }
}

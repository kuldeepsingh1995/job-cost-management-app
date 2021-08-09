import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderComponent } from './provider/provider.component';
import { AddProviderComponent } from './add-provider/add-provider.component';
import { HrComponent } from '../hr/hr.component';
import { ManagerComponent } from '../manager/manager.component';
import { RoleGuardService  as RoleGuard } from '../../shared/role-guard.service';
import { EmployeeManagerComponent } from '../employee-manager/employee-manager.component';
// , canActivate: [RoleGuard], data: { expectedRole: 'Not Admin' } 

const routes: Routes = [
  
  {
    path: 'edit-user/:id/:uid', component: AddProviderComponent, canActivate: [RoleGuard], data: { expectedRole: 'Admin' } 
  },
  {
    path: 'pending-user', component: ProviderComponent, canActivate: [RoleGuard], data: { expectedRole: 'Admin' }
  },
  {
    path: 'employee', component: HrComponent, canActivate: [RoleGuard], data: { expectedRole: 'Admin' } 
  },
  {
    path: 'manager', component: ManagerComponent, canActivate: [RoleGuard], data: { expectedRole: 'Admin' }
  },
  {
    path: 'employee-manager', component: EmployeeManagerComponent, canActivate: [RoleGuard], data: { expectedRole: '1' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }


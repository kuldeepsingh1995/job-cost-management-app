import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderComponent } from './provider/provider.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProviderRoutingModule } from './provider-routing.module';

import { AddProviderComponent } from './add-provider/add-provider.component';

import { FormBuilder, FormsModule } from '@angular/forms';
import { HrComponent } from '../hr/hr.component';
import { ManagerComponent } from '../manager/manager.component';
import { EmployeeManagerComponent } from '../employee-manager/employee-manager.component';



@NgModule({
  declarations: [ProviderComponent,AddProviderComponent,HrComponent,ManagerComponent,EmployeeManagerComponent ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    SharedModule,
    FormsModule      
  ]
})
export class ProviderModule { 
  constructor(private formBuilder: FormBuilder){

  }

}

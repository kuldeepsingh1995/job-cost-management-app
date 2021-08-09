import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { SharedService } from '../services/shared.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { RoleGuardService } from './role-guard.service';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    
    
  ],
  providers:[
    ApiService, SharedService,RoleGuardService
  ],
  exports: [
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class SharedModule { }

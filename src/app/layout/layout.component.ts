import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {myTest} from '../../assets/js/collapse.js'
import {check} from '../../assets/js/collapse.js'
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service.js';


@Component({
  providers: [ApiService],
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  environment = environment;
  userName    = '';
  email  = 'fetching..';
  constructor(
    public apiService: ApiService,
    private router: Router) { }
  role;
  is_admin: any;
  ngOnInit() {
    check();
    this.role = localStorage.getItem('role');
    let accessToken = localStorage.getItem('accessToken')
    this.is_admin = localStorage.getItem('is_admin')
    this.apiService.seacrhUserById(accessToken).valueChanges().subscribe((data: any) => {
      if (data.length != 0) {
        this.email = data[0].email
        this.role = data[0].role;
        this.is_admin = data[0].is_admin;
        localStorage.setItem('role', data[0].role);
        localStorage.setItem('is_admin', data[0].is_admin)
        localStorage.setItem('roleStatus', data[0].roleStatus)
      }
    })

   
    if(this.role=="1") {
      this.userName = 'Manager' + (this.is_admin ? '(Admin)' : '')
    } else if(this.role=="2") {
      this.userName = 'Employee' + (this.is_admin ? '(Admin)' : '')
    }
   }

  logout(){
    //console.log('here');
    localStorage.clear();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
  
  onClick() {
    myTest();
  }
 

}





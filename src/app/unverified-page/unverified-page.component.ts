import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SharedService } from '../services/shared.service';
declare var $ : any;

@Component({
  selector: 'app-unverified-page',
  templateUrl: './unverified-page.component.html',
  styleUrls: ['./unverified-page.component.scss']
})
export class UnverifiedPageComponent implements OnInit {

  constructor(
    public apiService: ApiService,
    public ngZone: NgZone,
    public router: Router, public sharedService: SharedService
  ) {
    
   }

  ngOnInit() {
    $('#loading').hide();   
    let roleStatus = localStorage.getItem('roleStatus');
    let role = localStorage.getItem('role');
    let accessToken = localStorage.getItem('accessToken');
    this.apiService.searchByKey('id', accessToken).valueChanges().subscribe((data: any) => {
     
      let roleStatus =  data[0].roleStatus;
      let role =  data[0].role;
  
      if (data.length != 0) {
        if(roleStatus && role){
          if (data.length != 0) {
            if(data[0].roleStatus == '0'){
              localStorage.setItem('roleStatus', data[0].roleStatus);
              this.router.navigate(['/unverified-page']);
            } else {
              if(data[0].role == 'Admin' && data[0].roleStatus == '1'){
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('role', data[0].role);
                localStorage.setItem('roleStatus', data[0].roleStatus);
                this.ngZone.run(() => {
                  this.router.navigate(['layout/dashboard']);
                });
              } else if (data[0].role == '1' && data[0].roleStatus == '1'){
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('role', data[0].role);
                localStorage.setItem('roleStatus', data[0].roleStatus);
                this.ngZone.run(() => {
                  this.router.navigate(['layout/users/employee-manager']);
                  
                });
              } else if (data[0].role == '2' && data[0].roleStatus == '1' ){
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('role', data[0].role);
                localStorage.setItem('roleStatus', data[0].roleStatus);
                if (data[0].managerId) {
                  localStorage.setItem('managerId', data[0].managerId);
                }
                if (data[0].clockit_empId) {
                  localStorage.setItem('clockit_empId', data[0].clockit_empId);
                }
                
                this.ngZone.run(() => {
                  this.router.navigate(['layout/dashboard']);
                });
              }else{
                this.sharedService.errorMsg('You are not allowed to login');
              }
            }

         $('#loading').hide(); 

        } else {

          //signup
          // this.usersRef.push({ id: result.user.uid, role: 'na', name: result.user.displayName, email: result.user.email, roleStatus:'0', clockin_emp_id: '' , is_new: '1'});
   
          // let mess = "Your registertion request has been subimitted to admin, please wait till approval.";
          // this.apiService.sendEmail({to: result.user.email, subject: 'User signup', mess: mess}).subscribe((data: any) => {
          //     $('#loading').hide(); 
          //   },(err) => {
          //     $('#loading').hide(); 
          // });
        
          // this.sharedService.successMsg('You have been successfully registered!.');
          // setTimeout(() => {
          //   localStorage.setItem('accessToken', result.user.uid);
          //   localStorage.setItem('role', 'na');
          //   this.router.navigate(['/unverified-page']);
          // }, 500);
        }
        }
      }
    });
     
  }

}

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/services/constants';
import { environment } from '../../../environments/environment';
import {ClockitService} from 'src/app/services/clockit.service';
declare var $ : any;
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { export_table_to_csv } from '../../../assets/js/exportcsv.js';
@Component({
  providers: [ClockitService],
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit { 
    status: any = 'new';
    baseurl : string = environment.url;
    data = [];
    public dates = [];
    public DataArr: any = [];
    page = 1;
    totalCount = 0;
    delaerId = '';
    PER_PAGE = CONSTANTS.PER_PAGE;
    searchText = '';
    manager_id = 'na';
    managerData: any = [];
    from_date: any = '';
    to_date: any = '';
    role:any = localStorage.getItem('role');
    days: any  = [];
    newData: any = [];
    constructor(public clockitService: ClockitService, private apiService: ApiService, private sharedService: SharedService,private router: Router, private readonly route: ActivatedRoute,  public afAuth: AngularFireAuth) {
      this.route.queryParams.subscribe(params => {

      });
      if (this.role == '1') {
        this.manager_id = localStorage.getItem('accessToken');
      }
    }
    donwloadcsv(){
      var html = document.querySelector("#mainTable").outerHTML;
      export_table_to_csv(html, "table.csv");
     }
     managerList() {
      this.managerData = [];
      firebase.database().ref('/users').orderByChild('role').equalTo('1').once('value').then(snapshot => {
        snapshot.forEach(child => {
          const post = child.val();
          if (post.roleStatus == '1') {
            post.key = child.key;
            this.managerData.push(post);
          }
        });
      });
    }
    from_date_fn() {
      this.data = [];
      let from_date:any = new Date(this.from_date);
      from_date = from_date.getTime();
      if (this.manager_id != '') {
        firebase.database().ref('/timesheetSubmission').orderByChild('manager_id').equalTo(this.manager_id).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            if (post.submitted_at > from_date) {
              post.key = child.key;
              this.apiService.searchByKey('id', post.emp_id).valueChanges().subscribe((data: any) => {
                post.employeeName = data[0].name;
              });
              if (post.manager_id) {
                this.apiService.searchByKey('id', post.manager_id).valueChanges().subscribe((data: any) => {
                  post.managerName = data[0].name;
                });
              } else {
                  post.managerName = '';
              }
              this.data.push(post);
            }

            this.totalCount = this.totalCount + 1;
          });
          // this.manupulateData();
          $('#loading').hide();
        });
      } else if (this.manager_id == '') {
        firebase.database().ref('/timesheetSubmission').orderByChild('submitted_at').startAt(from_date).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            post.key = child.key;
            this.apiService.searchByKey('id', post.emp_id).valueChanges().subscribe((data: any) => {
              post.employeeName = data[0].name;
            });
            if (post.manager_id) {
              this.apiService.searchByKey('id', post.manager_id).valueChanges().subscribe((data: any) => {
                post.managerName = data[0].name;
              });
            } else {
                post.managerName = '';
            }
            this.data.push(post);
            this.totalCount = this.totalCount + 1;
          });
          // this.manupulateData();
          $('#loading').hide();
        });
      }
      
    }

    to_date_fn() {
      this.data = [];
      this.filter()
      let to_date:any = new Date(this.to_date);
      to_date = to_date.getTime();
      let from_date:any = new Date(this.from_date);
      from_date = from_date.getTime();
      
      if (this.manager_id != '') {
        firebase.database().ref('/users').orderByChild('is_new').equalTo('0').once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();

            post.key = child.key;
            if (post.role == '2') {
              if (post.manager_id  == this.manager_id) {
                this.apiService.searchByKey('id', post.manager_id).valueChanges().subscribe((data: any) => {
                  post.managerName = data[0].name;
                });
              } else {
                  post.managerName = '';
              }
              this.data.push(post);
              this.totalCount = this.totalCount + 1;
            }
          });
          // this.manupulateData();
          this.loadClockitData()
        });
      } else if (this.manager_id == '') {
        firebase.database().ref('/users').orderByChild('is_new').equalTo('0').once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();

            if (post.role == '2') {

              post.key = child.key;
              if (post.manager_id) {
                this.apiService.searchByKey('id', post.manager_id).valueChanges().subscribe((data: any) => {
                  post.managerName = data[0].name;
                });
              } else {
                  post.managerName = '';
              }
              this.data.push(post);
              this.totalCount = this.totalCount + 1;

            }
          });
          // this.manupulateData();
          this.loadClockitData()
        });
      }
    }
    FilterManager() {
      this.data = [];
      this.totalCount = 0;
    
    }
    
    ngOnInit() {
      this.managerList();
      $('#loading').hide();
      
    }
    
    

   
    

    pageChanged($event) {
      this.page = $event;
      // this.getData($event);
    }
    timestamptoDate(Timestamp) {
      let dateOb = new Date(Timestamp);
      return dateOb.toDateString();
    }

    filter(){
      var firstday = new Date( this.from_date);
      var lastday = new Date(this.to_date);
      // Usage
      var dates   = this.getDates(firstday, lastday);                                                                                                           
      this.dates  = dates;
      console.log(this.dates, 'this.dates')
      // this.loadClockitData(this.dates[0].full_date, (this.dates[(this.dates.length - 1)].full_date));
    }
    getDates(startDate, endDate) {
      this.days = [];
      var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
      while (currentDate <= endDate) {
        let newFormat     = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + ("0" + currentDate.getDate()).slice(-2);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let month_name =   monthNames[currentDate.getMonth()];
        let smallFormat = currentDate.getDate() + '-' + month_name;
        let day_key  = currentDate.getDay();
        let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  
        let dateOb = {
          full_date: newFormat,
          small_date: smallFormat,
        };
        this.days.push(days[day_key]);
        dates.push(dateOb);
        currentDate = addDays.call(currentDate, 1);
      }
      return dates;
    }
    loadClockitData() {
      let start_date  = this.from_date;
      let end_date  = this.to_date;
      $('#loading').show();
      this.clockitService.basicAttendanceReport(start_date, end_date).then((clockData: any) => {
        // this.data is employee list
        if (this.data.length > 0) {
          this.data.forEach((emp: any) => {
            if(this.manager_id!='na'){
              if(emp.managerId == this.manager_id){
                this.subfunction(emp, clockData);
              }
            }else{
              this.subfunction(emp, clockData);
            }
            $('#loading').hide();
          })
        }
      });

    }
    subfunction(emp, clockData){
      emp.emp_total_hours = 0;
      emp.emp_total_break = 0;
      emp.dates = [];
      let clockItEmpId = emp.clockit_empId;
      
      if (clockItEmpId != '') {
        this.dates.forEach((CDate: any) => {
          if (clockData.length > 0) {
            clockData.forEach((cData: any) => {
              if (CDate.full_date == cData.date && clockItEmpId == cData.employee_id) {
                emp.dates.push({
                  full_date : CDate.full_date,
                  timeData : {
                    time_Worked: this.convertMS(cData.total_worked_duration_in_milliseconds),
                    time_break: this.convertMS(cData.total_breakDuration_in_milliseconds),
                  },
                })
                
                emp.emp_total_hours =  Math.floor(emp.emp_total_hours + cData.total_worked_duration_in_milliseconds);
                if(clockItEmpId=='11129' && cData.total_worked_duration_in_milliseconds!='0'){
                  console.log(CDate.full_date, cData.total_worked_duration_in_milliseconds)  
                }
                if (cData.total_breakDuration_in_milliseconds != 0) {
                  emp.emp_total_break += cData.total_breakDuration_in_milliseconds
                }

              }
             });
          }
        })
      }
    }
    convertMS( milliseconds ) {
      var day, hour, minute, seconds;
      seconds = Math.floor(milliseconds / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
      day = Math.floor(hour / 24);
      hour = hour % 24;
      return {
          day: day,
          hour: hour,
          minute: minute,
          seconds: seconds
      };
    }
    convertMS2( milliseconds ) {
      var day, hour, minute, seconds;
      seconds = Math.floor(milliseconds / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
      day = Math.floor(hour / 24);
      hour = hour % 24;
      return day+' days' + hour +' Hour '+minute+' min';
    }

    convertMS3( milliseconds ) {
      var hour, minute, seconds;
      seconds = Math.floor(milliseconds / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
     
      return hour +' Hour '+minute+' min';
    }
  //   get_add_two_times(json1, json2) {
  //     hr            = parseInt(json1.hour) + parseInt(json2.hour); 
  //     mn            = parseInt(json1.minutes) + parseInt(json2.minutes);
  //     final_hr      = hr + Math.floor(mn/60);
  //     final_mn      = mn%60;
  //     final_mn      = (final_mn < 10) ? '0' + final_mn : final_mn;
  
  //     return final_hr + 'h' + final_mn;
  // }
     
}

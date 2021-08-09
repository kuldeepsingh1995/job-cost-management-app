import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/services/constants';
import { environment } from '../../../environments/environment';

declare var $ : any;
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-timesheet-submissions',
  templateUrl: './timesheet-submissions.component.html',
  styleUrls: ['./timesheet-submissions.component.scss']
})
export class TimesheetSubmissionsComponent implements OnInit { 
    status: any = 'new';
    baseurl : string = environment.url;
    data = [];
    public newData: any = [];
    page = 1;
    totalCount = 0;
    delaerId = '';
    PER_PAGE = CONSTANTS.PER_PAGE;
    searchText = '';
    manager_id = '';
    managerData: any = [];
    from_date: any = '';
    to_date: any = '';
    role:any = localStorage.getItem('role');
    constructor(private apiService: ApiService, private sharedService: SharedService,private router: Router, private readonly route: ActivatedRoute,  public afAuth: AngularFireAuth) {
      this.route.queryParams.subscribe(params => {

      });
      if (this.role == '1') {
        this.manager_id = localStorage.getItem('accessToken');
      }
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
      console.log(this.from_date, 'this.from_date')
      let from_date:any = new Date(this.from_date);
      from_date = from_date.getTime();
      console.log(from_date);
      // .startAt(from_date).endAt(endDate)
      if (this.manager_id != '') {
        firebase.database().ref('/timesheetSubmission').orderByChild('manager_id').equalTo(this.manager_id).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            // console.log(post);
            console.log(post.submitted_at);
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
          this.manupulateData();
          $('#loading').hide();
        });
      } else if (this.manager_id == '') {
        firebase.database().ref('/timesheetSubmission').orderByChild('submitted_at').startAt(from_date).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            // console.log(post);
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
          this.manupulateData();
          $('#loading').hide();
        });
      }
      
    }

    to_date_fn() {
      console.log(this.to_date, 'to_date');
      this.data = [];
      let to_date:any = new Date(this.to_date);
      to_date = to_date.getTime();
      let from_date:any = new Date(this.from_date);
      from_date = from_date.getTime();
      
      // var from_date = from_date.getTime();
      // console.log(from_date);
      // .startAt(from_date).endAt(endDate)
      if (this.manager_id != '') {
        firebase.database().ref('/timesheetSubmission').orderByChild('manager_id').equalTo(this.manager_id).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();

            // console.log(post);
            if (post.submitted_at > from_date && post.submitted_at < to_date) {
            // if (this.from_date == post.start_date && this.to_date == post.end_date) {
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
          this.manupulateData();
          $('#loading').hide();
        });
      } else if (this.manager_id == '') {
        firebase.database().ref('/timesheetSubmission').startAt(from_date).endAt(to_date).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            // console.log(post);

            // if (this.from_date == post.start_date && this.to_date == post.end_date) {

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
            // }
            this.totalCount = this.totalCount + 1;
          });
          this.manupulateData();
          $('#loading').hide();
        });
      }
    }
    FilterManager() {
      console.log(this.manager_id);
      this.data = [];
      this.totalCount = 0;
      if (this.manager_id != '') {
        firebase.database().ref('/timesheetSubmission').orderByChild('manager_id').equalTo(this.manager_id).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            // console.log(post);
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
          this.manupulateData();
          $('#loading').hide();
        });
      }else{
        this.getData(this.page);
        this.manupulateData();
      }
    }
    FilterStatus() {
      this.data = [];
      this.totalCount = 0;
      if (this.status != 'new') {
        if (this.manager_id != '') {
          firebase.database().ref('/timesheetSubmission').orderByChild('manager_id').equalTo(this.manager_id).once('value').then(snapshot => {

            snapshot.forEach(child => {
              const post = child.val();
              // console.log(post);
              post.key = child.key;
              if (post.status == this.status) {
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
              }
            });
            this.manupulateData();
            $('#loading').hide();
          });
        } else {
          firebase.database().ref('/timesheetSubmission').once('value').then(snapshot => {

            snapshot.forEach(child => {
              const post = child.val();
              // console.log(post);
              post.key = child.key;
              if (post.status == this.status) {
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
              }
            });
            this.manupulateData();
            $('#loading').hide();
          });
        }
        
      } else {
        this.getData(this.page);
        this.manupulateData();
      }
    }
    ngOnInit() {
      this.managerList();
      // if (this.role!='Admin'){
        $('#loading').show();
      
        this.getData(this.page);
        this.manupulateData();
      // }else{
      //   $('#loading').hide();
      // }
    }
    
    search(value) {
      $('#loading').show(); 
      this.searchText = value;
    }

    getData(page) {
      this.data = [];
      this.totalCount = 0;
      if (this.role == 'Admin') {
        firebase.database().ref('/timesheetSubmission').once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            // console.log(post);
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
          this.manupulateData();
          $('#loading').hide();
        });
      } else {
        firebase.database().ref('/timesheetSubmission').orderByChild('manager_id').equalTo(localStorage.getItem('accessToken')).once('value').then(snapshot => {

          snapshot.forEach(child => {
            const post = child.val();
            // console.log(post);
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
          this.manupulateData();
          $('#loading').hide();
        });
      }


    }
    manupulateData() {
      this.data = this.data.slice().reverse();
      const newData = Array.from(new Set(this.data.map(x => x.start_date))).map(
        start_date => {
          return {
            start_date: start_date,
            emp_id: this.data.find(s => s.start_date == start_date).emp_id,
            employeeName: this.data.find(s => s.start_date == start_date).employeeName,
            end_date: this.data.find(s => s.start_date == start_date).end_date,
            key: this.data.find(s => s.start_date == start_date).key,
            managerName: this.data.find(s => s.start_date == start_date).managerName,
            manager_id: this.data.find(s => s.start_date == start_date).manager_id,
            remarks: this.data.find(s => s.start_date == start_date).remarks,
            status: this.data.find(s => s.start_date == start_date).status,
            submitted_at: this.data.find(s => s.start_date == start_date).submitted_at
          }
        }
      );
     
      this.newData = newData;
      this.newData.forEach((obj:any, index) => {
        this.apiService.searchByKey('id', obj.emp_id).valueChanges().subscribe((data: any) => {
          this.newData[index].employeeName = data[0].name;
        });
        if (obj.manager_id) {
          this.apiService.searchByKey('id', obj.manager_id).valueChanges().subscribe((data: any) => {
            this.newData[index].managerName = data[0].name;
          });
        } else {
            this.newData[index].managerName = '';
        }
      });
    }
    delete(id, uid) {
      this.sharedService.confirmButton().then((result) => {
        
        if(result.value){
        
          //this.apiService.deleteUser(id);
          this.getData(this.page);
          this.sharedService.successMsg('Data deleted successfully.');
        }
      });
    }

    edit(emp)
    {
      this.router.navigate(['layout/timesheet-view/' + emp.key]);
    }

    pageChanged($event) {
      this.page = $event;
      this.getData($event);
    }
    timestamptoDate(Timestamp) {
      let dateOb = new Date(Timestamp);
      return dateOb.toDateString();
    }

}

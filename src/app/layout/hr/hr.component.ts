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
  selector: 'app-hr',
  templateUrl: './hr.component.html',
  styleUrls: ['./hr.component.scss']
})
export class HrComponent implements OnInit {

    baseurl: string = environment.url;
    data = [];
    page = 1;
    totalCount = 0;
    delaerId = '';
    PER_PAGE = CONSTANTS.PER_PAGE;
    CONSTANTS = CONSTANTS;
    searchText = '';
    filterStatus: any = 'na';
    manager_id= '';
    managerData:any = [];
    constructor(private apiService: ApiService, private sharedService: SharedService,private router: Router, private readonly route: ActivatedRoute,  public afAuth: AngularFireAuth) {
      this.route.queryParams.subscribe(params => {

      });
     }
     FilterManager() {
       if (this.manager_id != "") {
        this.data = [];
        this.totalCount = 0;
        firebase.database().ref('/users').orderByChild('managerId').equalTo(this.manager_id).once('value').then(snapshot => {
          snapshot.forEach(child => {
            $('#loading').hide();
            const post = child.val();

            if (post.is_new == '0') {
              if(this.filterStatus!='na'){
                if(this.filterStatus == post.roleStatus){
                  post.key = child.key;
                  if (post.managerId) {
                    this.apiService.searchByKey('id', post.managerId).valueChanges().subscribe((data: any) => {
                      post.managerName = data[0].name;
                    });
                  } else {
                    post.managerName = '';
                  }
                  this.data.push(post);
                  this.totalCount = this.totalCount + 1;
                }
              }else{
                post.key = child.key;
                if (post.managerId) {
                  this.apiService.searchByKey('id', post.managerId).valueChanges().subscribe((data: any) => {
                    post.managerName = data[0].name;
                  });
                } else {
                  post.managerName = '';
                }
                this.data.push(post);
                this.totalCount = this.totalCount + 1;
              }              
            }
            
          });

          $('#loading').hide();
        });
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

    FilterStatus(event){
      let value = event.target.value;
      this.filterStatus = value;
      this.getData(this.page)
    }

    ngOnInit() {
      $('#loading').show();
      this.getData(this.page);
      this.managerList();
    
     }
    
    search(value){
      $('#loading').show(); 
      this.searchText = value;
      this.getData(this.page);
    }

     managerName(id) {
      return new Promise(res => {
        this.apiService.searchByKey('managerId', id).valueChanges().subscribe((data: any) => {

          res(true);
        });
      });
     }
    
    getData(page, managerId=null) {
      this.data = [];
      this.totalCount = 0;
      firebase.database().ref('/users').orderByChild('role').equalTo('2').once('value').then(snapshot => {
        snapshot.forEach(child => {
          $('#loading').hide();
          const post = child.val();
          if(post.is_new == '0') {
            if(this.filterStatus!='na'){
              if(this.filterStatus == post.roleStatus){
                post.key = child.key;
                if(post.managerId){
                  this.apiService.searchByKey('id', post.managerId).valueChanges().subscribe((data: any) => {
                    post.managerName = data[0].name;
                  });
                }else{
                  post.managerName = '';
                }
                this.data.push(post);
                this.totalCount = this.totalCount+1;
              }
            }else{
              post.key = child.key;
              if(post.managerId){
                this.apiService.searchByKey('id', post.managerId).valueChanges().subscribe((data: any) => {
                  post.managerName = data[0].name;
                });
              }else{
                post.managerName = '';
              }
              this.data.push(post);
              this.totalCount = this.totalCount+1;
            }


          }
        });

        $('#loading').hide();
      })
      
      //this.data = this.apiService.seacrhUserByStatus(0);
      // this.apiService.seacrhUserByStatus(0).valueChanges().subscribe((data: any) => {
      //   this.data = data;
      //   console.log(this.data);
      //   $('#loading').hide(); 
      // },(err) => {
      //   $('#loading').hide(); 
      //   if(err && err.hasOwnProperty('error'))
      //     this.sharedService.errorMsg(err.message);
      //   else
      //     this.sharedService.errorMsg(err.message);
      // })
    }

    delete(id,uid){
      this.sharedService.confirmButton().then((result) => {
        if (result.value) {
          //this.apiService.deleteUser(id);
          this.getData(this.page);
          this.sharedService.successMsg('Data deleted successfully.');
        }
      });
    }

    edit(id, uid)
    {
      this.router.navigate(['layout/users/edit-user/' + id+'/'+ uid]);
    }

    pageChanged($event) {
      this.page = $event;
      //this.getData($event);
    }
    getStatusLabel(roleStatus){
      let Find = this.CONSTANTS.STATUS.find(({id}) => id == roleStatus);
      if(Find){
        return Find.name;
      }
    }

}

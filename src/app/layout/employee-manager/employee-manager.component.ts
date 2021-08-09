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
  selector: 'app-employee-manager',
  templateUrl: './employee-manager.component.html',
  styleUrls: ['./employee-manager.component.scss']
})
export class EmployeeManagerComponent implements OnInit {

    baseurl : string = environment.url;
    data = [];
    page = 1;
    totalCount = 0;
    delaerId = '';
    PER_PAGE = CONSTANTS.PER_PAGE;
    searchText = ''; 
    constructor(private apiService: ApiService, private sharedService: SharedService,private router: Router, private readonly route: ActivatedRoute,  public afAuth: AngularFireAuth) {
      this.route.queryParams.subscribe(params => {
        
      });

     }
    
    ngOnInit() {
      $('#loading').show(); 
      this.getData(this.page);
    }
    
    search(value){
      $('#loading').show(); 
      this.searchText = value;
      this.getData(this.page);
    }

     managerName (id){
      return new Promise(res => {
        this.apiService.searchByKey('managerId',id).valueChanges().subscribe((data: any) => {
          console.log(data);
          if(data){
            //return data[0].name;
          }
          
          res(true);
        })
      }); 
     }
    
    getData(page) {
      this.data = [];
      this.totalCount = 0;
      firebase.database().ref('/users').orderByChild('managerId').equalTo(localStorage.getItem('accessToken')).once('value').then(snapshot => {
        snapshot.forEach(child => {
          $('#loading').hide();
          const post = child.val();
          if(post.roleStatus == '1' && post.role == '2') {
            post.key = child.key;

            this.apiService.searchByKey('id', post.managerId).valueChanges().subscribe((data: any) => {
              post.managerName = data[0].name;
            });

            this.data.push(post);
            this.totalCount = this.totalCount + 1;
          }
        });

        $('#loading').hide();
      });

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
        
        if(result.value){
        
          //this.apiService.deleteUser(id);
          this.getData(this.page);
          this.sharedService.successMsg('Data deleted successfully.');
        }
      })
    }
    
    edit(id,uid)
    {
      this.router.navigate(['layout/users/edit-user/' + id+'/'+ uid]);
    }

    pageChanged($event) {
      this.page = $event;
      //this.getData($event);
    }
    

}

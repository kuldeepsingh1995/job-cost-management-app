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
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit { 

    baseurl : string = environment.url;
    data = [];
    page = 1;
    totalCount = 0;
    delaerId = '';
    PER_PAGE = CONSTANTS.PER_PAGE;
    CONSTANTS = CONSTANTS;
    searchText = '';
    filterStatus: any = 'na';
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
    }

    getData(page){
      this.data = [];
      this.totalCount = 0;
      firebase.database().ref('/users').orderByChild('role').equalTo('1').once('value').then(snapshot => {
        
        snapshot.forEach(child => {
          const post = child.val();
          //console.log(post);
          
          if(post.is_new == '0'){
            if(this.filterStatus != 'na'){
              if(this.filterStatus == post.roleStatus){
                console.log(this.filterStatus)

                post.key = child.key;
                this.data.push(post);
                this.totalCount = this.totalCount+1;
              }
            }else{
              post.key = child.key;
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
    getStatusLabel(roleStatus){
      let Find = this.CONSTANTS.STATUS.find(({id}) => id == roleStatus);
      if(Find){
        return Find.name;
      }
    }
    FilterStatus(event){
      let value = event.target.value;
      this.filterStatus = value;
      this.getData(this.page)
    }
}

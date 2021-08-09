import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { CONSTANTS } from 'src/app/services/constants';
import { environment } from 'src/environments/environment';
declare var $ : any;
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html',
  styleUrls: ['./add-provider.component.scss']
})
export class AddProviderComponent implements OnInit {
  addEditForm  = new FormGroup({});
  submitted = false;
  imageError = false;
  CONSTANTS = CONSTANTS;
  id;
  uid;
  pTypes: any = [];
  imagePath : string = '';
  mangerList;
  oldData;
  
  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router,
    private activatedRoute: ActivatedRoute, private sharedService: SharedService) {
    this.activatedRoute.params.subscribe((params) => {
      $('#loading').show(); 
      this.id = params.id;
      this.uid = params.uid;

      if(this.id)
        this.getFormData();
    });
    var userRef = firebase.database().ref('/users');

    userRef.orderByChild('roleStatus').equalTo('1').once('value').then(snapshot => {
      this.mangerList = [];
      snapshot.forEach(child => {
        console.log(child);
        const post = child.val();
        if(post.role == '1' && post.id != this.id ){
          post.key = child.key;
          this.mangerList.push(post);
        }
      }); 
    });

  }

  ngOnInit() {
    this.initForm({});
  }
  
  onSelectedFile(event) {
    
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var ext = file.name.match(/\.(.+)$/)[1];
      if(ext == 'jpg' || ext == 'jpeg' || ext == 'png'){
        this.apiService.uploadImage('testomonial/upload', file).subscribe((data: any) => {
          this.imageError = false;
          this.imagePath = environment.url+'uploads/'+data.fileUrl;
          this.addEditForm.get('logo').setValue(data.fileUrl);
        },(err) => {
          //console.log(err);
          if(err && err.hasOwnProperty('error'))
            this.sharedService.errorMsg(err.error.message);
          else
            this.sharedService.errorMsg(CONSTANTS.GLOBAL_ERROR_MSG);
        }); 
      }else{
        this.imageError = true;
      }
    }
  }

  getFormData(){
    this.apiService.seacrhUserById(this.id).valueChanges().subscribe((data: any) => {
      $('#loading').hide(); 
      this.oldData = data[0];
      //console.log(data);
      //this.imagePath = environment.url+'uploads/providers/'+data.data.logo;
      // set form value
      this.initForm(data[0]);
    })
  }

  initForm(data: any) {
    this.addEditForm = this.formBuilder.group({
      name: new FormControl(data.name,Validators.required),
      role : new FormControl(data.role,Validators.required),
      roleStatus: new FormControl(data.roleStatus), 
      managerId: new FormControl(data.managerId || ''),
      clockit_empId: new FormControl(data.clockit_empId || ''),
      is_admin: new FormControl(data.is_admin || false),
      
    });
  }

  onSubmit() {
    this.submitted = true;
    //$('#loading').show(); 
    // stop here if form is invalid
    if (this.addEditForm.invalid) {
      return;
    }
    const result: any = this.addEditForm.value;
    if(result.role=='na' || result.role==''){
      alert('Please select employee role');
      return false;
    }else if(result.roleStatus=='na' || result.roleStatus===''){
      alert('Please select employee status');
      return false;
    }else if(this.id){
     
       
      // if manger check he is manager of any employee
      if(result.role == '2'){
        
        if(result.managerId == ''){
          this.sharedService.errorMsg('Please select alteast one manager.');
          return;
        }

        this.apiService.searchByKey('managerId', this.id).valueChanges().subscribe((data: any) => {
         
           
           
         // console.log(this.oldData);
          
          if (data.length > 0) {
            this.sharedService.errorMsg('Please unassign all employee under this manager.');
          }
          if(result.clockit_empId){
            localStorage.setItem('clockit_empId', result.clockit_empId);
          }
          if(this.oldData.managerId != result.managerId){
            this.apiService.searchByKey('id', result.managerId).valueChanges().subscribe((data: any) => {
              //console.log(data);
              // send email to employee
               const mess = data[0].name+" manager has been assigned to you.";
               this.apiService.sendEmail({to: this.oldData.email, subject: 'Manager assigned', mess: mess}).subscribe((data: any) => {
               
                 },(err) => {
                 
              });
              
               // send email to manager
               const mess1 = this.oldData.name+ " Employee has been assigned to you.";
               this.apiService.sendEmail({to: data[0].email, subject: 'Employee assigned', mess: mess1}).subscribe((data: any) => {
                 
                 },(err) => {
                   
               }); });
          }
            

          if(result.name){
            this.apiService.updateItem(this.uid,{name : result.name});
          }
          if(result.role){
            this.apiService.updateItem(this.uid,{role : result.role});
          }
          if(result.roleStatus){
            this.apiService.updateItem(this.uid,{roleStatus : result.roleStatus});
          }
          if(result.managerId){
            this.apiService.updateItem(this.uid,{managerId : result.managerId});
          }
          if(result.clockit_empId){
            this.apiService.updateItem(this.uid,{clockit_empId : result.clockit_empId});
          }
          this.apiService.updateItem(this.uid,{is_new : '0'});
          this.apiService.updateItem(this.uid,{is_admin : result.is_admin});
          
          this.sharedService.successMsg('Data updated successfully.');

          
        });
      }else{

        if(result.name){
          this.apiService.updateItem(this.uid,{name : result.name});
        }
        if(result.role){
          this.apiService.updateItem(this.uid,{role : result.role});
        }
        if(result.roleStatus){
          this.apiService.updateItem(this.uid,{roleStatus : result.roleStatus});
        }
        if(result.managerId){
          this.apiService.updateItem(this.uid,{managerId : result.managerId});
        }

        this.apiService.updateItem(this.uid,{is_new : '0'});
       
        this.apiService.updateItem(this.uid,{is_admin : result.is_admin});
        
        
        if(this.oldData.roleStatus ==  '0'){
          const mess2 = "You become manager now.";
          this.apiService.sendEmail({to: this.oldData.email, subject: 'Your are manager', mess: mess2}).subscribe((data: any) => {
            
            },(err) => {
              
          });
        }
        else if(this.oldData.roleStatus ==  'Admin'){
          const mess2 = "You become admin now.";
          this.apiService.sendEmail({to: this.oldData.email, subject: 'Your are admin', mess: mess2}).subscribe((data: any) => {
            
            },(err) => {
              
          });
        }
      

        this.sharedService.successMsg('Data updated successfully.');
      }

      
     
      
      //this.router.navigate(['/layout/users/app-user']);

    }else{

      this.apiService.postRequest('admin/updateAppUser', this.addEditForm.value).subscribe((data: any) => {

        this.sharedService.successMsg('Data added successfully.');

        this.router.navigate(['/layout/users/app-user']);
      },(err) => {
        //console.log(err);
        if(err && err.hasOwnProperty('error'))
          this.sharedService.errorMsg(err.error.message);
        else
          this.sharedService.errorMsg(CONSTANTS.GLOBAL_ERROR_MSG);
      });
    }
  }
  
  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required' }
    ],
    }

}

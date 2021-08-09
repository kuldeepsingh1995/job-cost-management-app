import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedService } from '../services/shared.service';
declare var $ : any;
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { auth } from  'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  environment = environment;
  usersRef: AngularFireList<any>;
  users:AngularFireList<any>;
  items$: Observable<any[]>;
  constructor(private fb: FormBuilder, private apiService: ApiService,  private router: Router,
    private sharedService: SharedService, public afAuth: AngularFireAuth, public ngZone: NgZone , public db: AngularFireDatabase) { 
     
     
      

      //this.users = this.apiService.seacrhUserById();
      this.usersRef = db.list('users');
      console.log(this.users);

    }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: '',
      email: '',
      password: '',
      role:'',
     });

    $('#loading').hide(); 
  }
  
  signupWithMicrosoft(){
    let provider = new auth.OAuthProvider('microsoft.com');
  
    this.afAuth.signInWithPopup(provider).then((result) => {
      // User is signed in.
      console.log(result, 'result')
         //login  
      this.apiService.searchByKey('email', result.user.email).valueChanges().subscribe((data: any) => {
              if (data.length != 0) {
                if(data[0].roleStatus == '0'){
                  this.router.navigate(['/unverified-page']);
                } else {
                  if(data[0].role == 'Admin' && data[0].roleStatus == '1'){
                    localStorage.setItem('accessToken', result.user.uid);
                    localStorage.setItem('role', data[0].role);
                    this.ngZone.run(() => {
                      this.router.navigate(['layout/dashboard']);
                    });
                  } else if (data[0].role == '1' && data[0].roleStatus == '1'){
                    localStorage.setItem('accessToken', result.user.uid);
                    localStorage.setItem('role', data[0].role);
                    this.ngZone.run(() => {
                      this.router.navigate(['layout/users/employee-manager']);
                      
                    });
                  } else if (data[0].role == '2' && data[0].roleStatus == '1' ){
                    localStorage.setItem('accessToken', result.user.uid);
                    localStorage.setItem('role', data[0].role);
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
              this.usersRef.push({ id: result.user.uid, role: 'na', name: result.user.displayName, email: result.user.email, roleStatus:'0', clockin_emp_id: '', is_new: '1' });
       
              let mess = "Your registertion request has been subimitted to admin, please wait till approval.";
              this.apiService.sendEmail({to: result.user.email, subject: 'User signup', mess: mess}).subscribe((data: any) => {
                  $('#loading').hide(); 
                },(err) => {
                  $('#loading').hide(); 
              });
            
              this.sharedService.successMsg('You have been successfully registered!.');
              setTimeout(() => {
                localStorage.setItem('accessToken', result.user.uid);
                localStorage.setItem('role', 'na');
                this.router.navigate(['/unverified-page']);
              }, 500);
            }


           },(err) => {
             $('#loading').hide(); 
             if(err && err.hasOwnProperty('error'))
               this.sharedService.errorMsg(err.error.message);
             else
               this.sharedService.errorMsg(err.error.message);
           })




          
          

     
      })
      


      
     
  }
  // signupWithMicrosoft(){
  //   let provider = new auth.OAuthProvider('microsoft.com');
  
    
  //   // provider.addScope('User.Read');

 
    
  //   this.afAuth.signInWithPopup(provider).then((result) => {
  //     console.log('signinResult' ,result)
  //     // User is signed in.
  //     this.usersRef.push({ id: result.user.uid, role: 'na', name: result.user.displayName, email: result.user.email, roleStatus:'0', clockin_emp_id: '' });
     
  //     let mess = "Your registertion request has been subimitted to admin, please wait till approval.";
  //     this.apiService.sendEmail({to: result.user.email, subject: 'User signup', mess: mess}).subscribe((data: any) => {
  //         $('#loading').hide(); 
  //       },(err) => {
  //         $('#loading').hide(); 
  //     });
     
  //     this.sharedService.successMsg('You have been successfully registered!.');
  //     setTimeout(() => {
  //       localStorage.setItem('accessToken', result.user.uid);
  //       localStorage.setItem('role', 'na');
  //       this.router.navigate(['/unverified-page']);
  //     }, 500);
  //   })
  //   .catch((error) => {
  //     // Handle error.
  //     // this.sharedService.errorMsg(error.message);
  //     // console.log('signinError' ,error)
  //   });
  //     // this.router.navigate(['admin/list']);
  // }
  onSubmit(form){
    $('#loading').show();
    let email = form.value.email;
    let password = form.value.password;
    
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      this.usersRef.push({ id: result.user.uid, role: form.value.role, name: form.value.name, email: form.value.email, roleStatus:'0', clockin_emp_id: '', is_new: '1'  });
     
      let mess = "Your registertion request has been subimitted to admin, please wait till approval.";
      this.apiService.sendEmail({to: form.value.email, subject: 'User signup', mess: mess}).subscribe((data: any) => {
        $('#loading').hide(); 
        },(err) => {
          $('#loading').hide(); 
      });

     
      this.sharedService.successMsg('You have been successfully registered!.');
      this.signupForm.reset();
     }).catch((error) => {
      $('#loading').hide(); 
      this.sharedService.errorMsg(error.message);
    })

  }

}

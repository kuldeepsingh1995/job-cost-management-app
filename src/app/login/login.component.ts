import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedService } from '../services/shared.service';
declare var $: any;
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  environment = environment;
  usersRef: AngularFireList<any>;
  data$;
  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router,
    private sharedService: SharedService,
    public afAuth: AngularFireAuth, public ngZone: NgZone,
    public db: AngularFireDatabase, private fns: AngularFireFunctions) {
    //this.afAuth.signOut();
    this.usersRef = db.list('users');
    //console.log(this.usersRef);
    const callable = fns.httpsCallable('my-fn-name');
    this.data$ = callable({ name: 'some-data' });
    let roleStatus = localStorage.getItem('roleStatus');
    let role = localStorage.getItem('role');
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      this.apiService.searchByKey('id', accessToken).valueChanges().subscribe((data: any) => {
        if(data[0]){
          let roleStatus = data[0].roleStatus;
          let role = data[0].role;
          if (data.length != 0) {
            if (roleStatus && role) {
              if (data.length != 0) {
                if (data[0].roleStatus == '0') {
                  localStorage.setItem('roleStatus', data[0].roleStatus);
                  this.router.navigate(['/unverified-page']);
                } else {
                  if (data[0].clockit_empId) {
                    localStorage.setItem('clockit_empId', data[0].clockit_empId);
                  }
                  if (data[0].role == 'Admin' && data[0].roleStatus == '1') {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('role', data[0].role);
                    localStorage.setItem('roleStatus', data[0].roleStatus);
                    this.ngZone.run(() => {
                      this.router.navigate(['layout/dashboard']);
                    });
                  } else if (data[0].role == '1' && data[0].roleStatus == '1') {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('role', data[0].role);
                    localStorage.setItem('roleStatus', data[0].roleStatus);
                    this.ngZone.run(() => {
                      this.router.navigate(['layout/users/employee-manager']);
  
                    });
                  } else if (data[0].role == '2' && data[0].roleStatus == '1') {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('role', data[0].role);
                    localStorage.setItem('roleStatus', data[0].roleStatus);
                    if (data[0].managerId) {
                      localStorage.setItem('managerId', data[0].managerId);
                    }
                    
  
                    this.ngZone.run(() => {
                      this.router.navigate(['layout/dashboard']);
                    });
                  } else {
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
        }
        
      });
    }


  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    });
    $('#loading').hide();
  }
  signinWithMicrosoft() {
    let provider = new auth.OAuthProvider('microsoft.com');

    this.afAuth.signInWithPopup(provider).then((result) => {
      // User is signed in.
      //login  
      this.apiService.searchByKey('email', result.user.email).valueChanges().subscribe((data: any) => {
        if (data.length != 0) {
          if (data[0].roleStatus == '0') {
            localStorage.setItem('roleStatus', data[0].roleStatus);
            this.router.navigate(['/unverified-page']);
          } else {
           if (data[0].role == '1' && data[0].roleStatus == '1') {
              localStorage.setItem('accessToken', result.user.uid);
              localStorage.setItem('role', data[0].role);
              localStorage.setItem('roleStatus', data[0].roleStatus);
              localStorage.setItem('is_admin', data[0].is_admin);
              if(data[0].is_admin){
                this.ngZone.run(() => {
                  this.router.navigate(['layout/dashboard']);
                });                
              }else{
                this.ngZone.run(() => {
                  this.router.navigate(['layout/users/employee-manager']);
                });
              }
            } else if (data[0].role == '2' && data[0].roleStatus == '1') {
              localStorage.setItem('accessToken', result.user.uid);
              localStorage.setItem('role', data[0].role);
              localStorage.setItem('roleStatus', data[0].roleStatus);
              localStorage.setItem('is_admin', data[0].is_admin);
              if (data[0].managerId) {
                localStorage.setItem('managerId', data[0].managerId);
              }
              if (data[0].clockit_empId) {
                localStorage.setItem('clockit_empId', data[0].clockit_empId);
              }

              this.ngZone.run(() => {
                this.router.navigate(['layout/dashboard']);
              });
            } else {
              this.sharedService.errorMsg('You are not allowed to login');
            }
          }

          $('#loading').hide();

        } else {
          if(result.user.uid){
            //signup
            this.usersRef.push({ id: result.user.uid, role: 'na', name: result.user.displayName, email: result.user.email, roleStatus: '0', clockin_emp_id: '', is_new: '1' });

            let mess = "Your registertion request has been subimitted to admin, please wait till approval.";
            this.apiService.sendEmail({ to: result.user.email, subject: 'User signup', mess: mess }).subscribe((data: any) => {
              $('#loading').hide();
            }, (err) => {
              $('#loading').hide();
            });            
          } 


          this.sharedService.successMsg('You have been successfully registered!.');
          setTimeout(() => {
            localStorage.setItem('accessToken', result.user.uid);
            localStorage.setItem('role', 'na');
            this.router.navigate(['/unverified-page']);
          }, 500);
        }


      }, (err) => {
        $('#loading').hide();
        if (err && err.hasOwnProperty('error'))
          this.sharedService.errorMsg(err.error.message);
        else
          this.sharedService.errorMsg(err.error.message);
      })
    })
  }

  onSubmit(form) {
    $('#loading').show();
    let email = form.value.email;
    let password = form.value.password;

    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.apiService.seacrhUserById(result.user.uid).valueChanges().subscribe((data: any) => {
          if (data[0].role == 'Admin' && data[0].roleStatus == '1') {
            localStorage.setItem('accessToken', result.user.uid);
            localStorage.setItem('role', data[0].role);
            this.ngZone.run(() => {
              this.router.navigate(['layout/dashboard']);
            });
          } else if (data[0].role == '1' && data[0].roleStatus == '1') {
            localStorage.setItem('accessToken', result.user.uid);
            localStorage.setItem('role', data[0].role);
            this.ngZone.run(() => {
              this.router.navigate(['layout/users/employee-manager']);

            });
          } else if (data[0].role == '2' && data[0].roleStatus == '1') {
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
          } else {
            this.sharedService.errorMsg('You are not allowed to login');
          }
          $('#loading').hide();
        }, (err) => {
          $('#loading').hide();
          if (err && err.hasOwnProperty('error'))
            this.sharedService.errorMsg(err.error.message);
          else
            this.sharedService.errorMsg(err.error.message);
        })
        //this.SetUserData(result.user);
      }).catch((error) => {
        $('#loading').hide();
        console.log(error.message);
        this.sharedService.errorMsg(error.message);
      })

    // this.apiService.postRequest('users/login',form.value).subscribe((data: any) => {

    //   localStorage.setItem('accessToken', data.data);
    //   this.router.navigate(['layout/dashboard']);
    // },(err) => {
    //   $('#loading').hide(); 
    //   if(err && err.hasOwnProperty('error'))
    //     this.sharedService.errorMsg(err.error.message);
    //   else
    //     this.sharedService.errorMsg(err.error.message);
    // })
  }

}

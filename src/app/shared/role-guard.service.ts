import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(private apiService: ApiService, public router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean | Promise<boolean> {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;


    const token = localStorage.getItem('accessToken');
    
    return new Promise(res => {
      this.apiService.searchByKey('id', token).valueChanges().subscribe((data: any) => {
        if (data) {
          if(expectedRole=='Admin') {
            if (data[0].is_admin) {
              localStorage.setItem('role', data[0].role);
              res(true);
            } else {
              this.router.navigate(['login']);
              res(false);
            }
          }else{
            if (data[0].role == expectedRole) {
              localStorage.setItem('role', data[0].role);
              res(true);
            } else {
              this.router.navigate(['login']);
              res(false);
            }
          }
          
        }


      }, (err) => {
        this.router.navigate(['login']);
        res(false);
      });
    });



    // decode the token to get its payload
    // const tokenPayload = decode(token);
    // if (
    //   !this.auth.isAuthenticated() || 
    //   tokenPayload.role !== expectedRole
    // ) {
    //   this.router.navigate(['login']);
    //   return false;
    // }

  }
}

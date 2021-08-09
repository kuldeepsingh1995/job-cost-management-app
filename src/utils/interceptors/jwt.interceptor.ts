import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /********** add authorization header with jwt token if available **********/
    const user: any = localStorage.getItem('accessToken');
    //console.log(user);
    if (user) {
      request = request.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${user}`
        })
      });
    }

    return next.handle(request);
  }
}


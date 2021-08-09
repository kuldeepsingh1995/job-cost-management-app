import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private commonService: SharedService
    ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      
      switch (err.status) {
        case 401:
          /********** Auto logout if 401 response returned from api **********/
          
          this.commonService.errorMsg(err.error.message);
          break;

        case 0:
          /********** If server dosent respond **********/
          this.commonService.errorMsg(err.error.message);
          break;

        default:
          /********** Check for other serve-side errors **********/
          this.commonService.errorMsg(err.error.message);
          break;
      }
        return throwError(err);
    }));
  }
}

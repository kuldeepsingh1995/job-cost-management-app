import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ClockitService {
  headers_object;
  baseUrl: any = 'https://api.clockit.io/api/v1/app/x7Nyk/';
  token = 'tick_a2e9829260d0fe3c852fd9e558ec181785ab72a2ae364088f7e828714b4d9e00.clockit.io';
  constructor(private http: HttpClient, ) {
    this.headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.token).set('Content-Type', 'application/json');

  }

  

  
  basicAttendanceReport(start_date, end_date, emp_id='all'){
    return new Promise((resolve, reject) => {
      const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          })
        };
      this.http.get(this.baseUrl + 'basic_reports/attendance_report?start_date='+start_date+'&end_date='+end_date,  httpOptions).toPromise()
      .then((resp: any) => {
        if(emp_id=='all'){
          resolve(resp.data);
        } else {
          let employees = resp.data;
          let filterEmp = employees.filter(function (e) {
            return e.employee_id == emp_id;
          });
          resolve(filterEmp);
        }
      });      
    });

  }
}

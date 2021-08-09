import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Injectable()
export class SharedService {

  constructor() {
    
  }
  
  baseUrl(){
    return environment.url;
  }
  
  

  successMsg(msg){
    Swal.fire({
        title: 'Success!',
        text: msg,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      })
  }

  errorMsg(msg){
    Swal.fire({
        title: 'Error!',
        text: msg,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      })
  }
  confirmButton(){
    return Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
  }
  confirmButton1(){
    return Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      })
  }
  
  

}

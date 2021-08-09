import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANTS } from 'src/app/services/constants';

declare var $ : any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: any;
  addEditForm  = new FormGroup({});
  submitted = false;
  CONSTANTS = CONSTANTS;
  auction = [];
  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router,
    private activatedRoute: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {
    $('#loading').hide(); 
    //this.getData();

    // this.apiService.getRequest('admin/getSetting').subscribe((data: any) => {
    //   //console.log(data);
    //   this.initForm((data.data)?data.data:[]);
    //   this.auction = (data.data)?data.data.auction:[];
    // });

    //this.initForm({});
  }
  
 
  initForm(data) {
    
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addEditForm.invalid) {
      return;
    }
   

  }

}

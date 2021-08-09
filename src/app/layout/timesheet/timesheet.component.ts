import { Component, OnInit } from '@angular/core';
import { TimesheetService } from 'src/app/services/Timesheet.service';
import { TimesheetSubmissionService } from 'src/app/services/timesheetSubmission.service';
declare var $: any;
import { Timesheet } from 'src/app/entity/timesheet';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ClockitService } from 'src/app/services/clockit.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  providers: [TimesheetService, TimesheetSubmissionService, ClockitService],
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  public disableAllInputs = false;
  public displayAlreadySubMsg = false;
  public displayApprovedMsg = false;
  public displayRejectedMsg = false;
  public RejectedReason: any = '';
  public timesheetSubmissions: any = [];
  public timesheetSubmissionsLogs: any = [];
  public dates = [];
  public days = [];
  public HoursWorked: any = [];
  public displayTimesheetSubmitNotificaiton: any = false;
  public emp_id: any = localStorage.getItem('accessToken');
  public start_date: any;
  public end_date: any;
  public status: any = 'new';
  public compaines = [
    {
      company_name: 'Prayog Labs, LLC:',
      titles: [
        {
          name: 'prayog_sbir',
          label: 'SBIR Phase II'
        },
        {
          name: 'prayog_admin',
          label: 'Admin'
        },
        {
          name: 'prayog_other',
          label: 'Other'
        },

      ]
    },
    {
      company_name: 'Thar Process:',
      titles: [
        {
          name: 'thar_process_tolling',
          label: 'Tolling'
        },
        {
          name: 'thar_process_fabrication',
          label: 'Fabrication'
        },
        {
          name: 'thar_process_lab',
          label: 'Lab'
        },
        {
          name: 'thar_process_admin',
          label: 'Admin'
        },
        {
          name: 'thar_process_marketing_sales',
          label: 'Marketing/Sales'
        },
        {
          name: 'thar_process_other',
          label: 'Other'
        },
      ]
    },
    {
      company_name: 'Thar Energy:',
      titles: [
        {
          name: 'thar_energy_arpae_power_system',
          label: 'ARPA-E Power System'
        },
        {
          name: 'thar_energy_de_fe26273_modular_hx_project',
          label: 'DE-FE26273 Modular HX Project'
        },
        {
          name: 'thar_energy_de_SC0020844_Adv_Coupling',
          label: 'DE-SC0020844 Adv. Coupling'
        },
        {
          name: 'thar_energy_admin',
          label: 'Admin'
        },
        {
          name: 'thar_energy_marketing_sales',
          label: 'Other'
        },
      ]
    },
    {
      company_name: 'PTO/HOLIDAY:',
      titles: [
        {
          name: 'paid_time_off',
          label: 'Paid Time Off'
        },
        {
          name: 'Paid_Sick_Leave',
          label: 'Paid Sick  Leave'
        },
        {
          name: 'Expanded_FMLA_Leave',
          label: 'Expanded FMLA Leave'
        },
        {
          name: 'Holiday',
          label: 'Holiday'
        },
        {
          name: 'Unpaid_Time_Off',
          label: 'Unpaid Time Off'
        },
        {
          name: 'Other',
          label: 'Other'
        },
      ]
    },

  ];
  public timesheetData: any = [];
  public totalCount = 0;
  public key_of_timesheet: any = '';
  public clockData: any = [];
  public clockItEmpId: any = '';
  public empRole: any = localStorage.getItem('role');
  constructor(
    public apiService: ApiService,
    public clockitService: ClockitService, public active_route: ActivatedRoute, public timesheetServ: TimesheetService, public timesheetSubmitService: TimesheetSubmissionService) {

    this.active_route.params.subscribe((params) => {
      // $('#loading').show();
      if (params.key) {
        this.key_of_timesheet = params.key;
        let Data = this.timesheetSubmitService.getSingleItem(params.key).snapshotChanges().pipe(
          map(changes =>
            changes.map((c: any) => {
              return c.payload.val();
            }
            )
          )
        ).subscribe(data => {
          // this.timesheetSubmissions = data;
          this.emp_id = data[0];
          this.end_date = data[1];
          this.start_date = data[4];
          this.status = data[5];
          let dates = this.generate_dates(this.start_date);
          this.dates = dates;
          console.log(dates, 'dates')
          this.loadClockitData(this.dates[0].full_date, (this.dates[(this.dates.length - 1)].full_date));
          this.retrieveTimesheet();
          setTimeout(() => {
            this.retrieveTimesheetSubmissions();
          }, 1000);
        });
      } else {
        // let currentDate: any = new Date();
        // currentDate = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
        // var curr  = new Date; // get current date
        // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        // var last  = first + 6; // last day is the first day + 6

        // var firstday = new Date(curr.setDate(first));
        // var lastday = new Date(curr.setDate(last));
        // // Usage
        // var dates   = this.getDates(firstday, lastday);
        let dates = this.generate_dates();
        this.dates = dates;
        this.loadClockitData(this.dates[0].full_date, (this.dates[(this.dates.length - 1)].full_date));
        this.retrieveTimesheet();
        setTimeout(() => {
          this.retrieveTimesheetSubmissions();
        }, 1000);
      }

    });
  }
  loadClockitData(start_date, end_date) {
    this.apiService.seacrhUserById(this.emp_id).valueChanges().subscribe((data: any) => {
      if (data.length != 0) {
        console.log(data, 'data')
        this.clockItEmpId = data[0].clockin_emp_id;
        if (this.clockItEmpId != '' && this.clockItEmpId != null) {
          this.clockitService.basicAttendanceReport(start_date, end_date, this.clockItEmpId).then((resp: any) => {
            this.clockData = resp;
            console.log(this.clockData, 'this.clockData')
            console.log(this.dates, 'this.dates')
            if (this.clockData.length > 0) {
              this.clockData.forEach((data: any) => {
                this.dates.forEach((date_: any) => {
                  if (date_.full_date == data.date) {
                    date_.punched_in = data.punched_in;
                    date_.punched_out = data.punched_out;
                    if (data.total_breakDuration_in_milliseconds != null) {
                      date_.breakTime = this.convertMS(data.total_breakDuration_in_milliseconds)
                    }
                  }
                });
              });
            }
          });
        }
      }
    })
  }
  convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }
  generate_dates(start_date = null) {
    if (start_date == null) {
      var curr = new Date; // get current date
    } else {
      var curr = new Date(start_date); // get current date
    }
    console.log(curr.getDate(), curr.getDay())
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    // var last        = first + 6; // last day is the first day + 6


    function addDays(dateObj, numDays) {
      dateObj.setDate(dateObj.getDate() + numDays);
      return dateObj;
    }
    var firstday = new Date(curr.setDate(first));
    var lastday = addDays(curr, 6);
    // Usage
    console.log('firstday', firstday, lastday);
    var dates = this.getDates(firstday, lastday);
    return dates;
  }

  retrieveTimesheetSubmissions(): void {
    this.timesheetSubmitService.listData('emp_id', this.emp_id).snapshotChanges().pipe(
      map(changes =>
        changes.map((c: any) => {
          return ({ key: c.payload.key, ...c.payload.val() });
        }
        )
      )
    ).subscribe(data => {
      this.timesheetSubmissions = data;
      let StartDate = this.dates[0];
      let EndDate = this.dates[this.dates.length - 1];
      this.timesheetSubmissionsLogs = [];
      this.timesheetSubmissions.forEach((obj: any) => {
        if (obj.start_date == StartDate.full_date && obj.end_date == EndDate.full_date) {
          this.timesheetSubmissionsLogs.push(obj);
        }
      });

      if (this.key_of_timesheet) {
        this.timesheetSubmissions.forEach((obj: any) => {
          if (obj.start_date == StartDate.full_date && obj.end_date == EndDate.full_date) {
            if (this.key_of_timesheet == obj.key) {
              if (obj.status == 0) {
                this.displayAlreadySubMsg = true;
                this.displayApprovedMsg = false;
                this.displayRejectedMsg = false;
                this.disableAllInputs = true;
              }
              if (obj.status == 1) {
                this.displayApprovedMsg = true;
                this.displayRejectedMsg = false;
                this.displayAlreadySubMsg = false;
                this.disableAllInputs = true;
              }
              if (obj.status == 2) {
                this.RejectedReason = obj.remarks;
                this.displayAlreadySubMsg = false;
                this.displayApprovedMsg = false;
                this.displayRejectedMsg = true;
                this.disableAllInputs = false;
              }
            }
          }
        });
      } else {
        let obj = this.timesheetSubmissions[this.timesheetSubmissions.length - 1];
        this.key_of_timesheet = obj.key;
        if (obj.status == 0) {
          this.displayAlreadySubMsg = true;
          this.displayApprovedMsg = false;
          this.displayRejectedMsg = false;
          this.disableAllInputs = true;
        }
        if (obj.status == 1) {
          this.displayApprovedMsg = true;
          this.displayRejectedMsg = false;
          this.displayAlreadySubMsg = false;
          this.disableAllInputs = true;
        }
        if (obj.status == 2) {
          this.RejectedReason = obj.remarks;
          this.displayAlreadySubMsg = false;
          this.displayApprovedMsg = false;
          this.displayRejectedMsg = true;
        }
      }
    });
  }
  retrieveTimesheet(): void {
    this.timesheetServ.listData('emp_id', this.emp_id).snapshotChanges().pipe(
      map(changes =>
        changes.map((c: any) => {
          return ({ key: c.payload.key, ...c.payload.val() });
        }
        )
      )
    ).subscribe(data => {
      this.timesheetData = data;
      console.log(this.timesheetData, 'this.timesheetData')
      this.timesheetData.forEach((obj: any) => {
        // this.HoursWorked[obj.date] = obj.hours_worked;
        $('#' + obj.date + '__' + obj.task_name).val(obj.hours_worked);
        // if (obj.date == SheetDate && obj.task_name == task_name && CompanyID == obj.company_name) {
        //   return obj.hours_worked;
        // }
      });
    });
  }

  getDates(startDate, endDate) {
    this.days = [];
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      let newFormat = currentDate.getFullYear() + "-" + ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let month_name = monthNames[currentDate.getMonth()];
      let smallFormat = ("0" + currentDate.getDate()).slice(-2) + '-' + month_name;
      let day_key = currentDate.getDay();
      let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

      let dateOb = {
        full_date: newFormat,
        small_date: smallFormat,
      };
      this.days.push(days[day_key]);
      dates.push(dateOb);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }
  ngOnInit() {
    $('#loading').hide();
  }

  hourInput(event: Event, SheetDate, CompanyID, task_name) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (!filterValue) {
      return;
    }
    if (filterValue != '') {
      let ApiType = 'save';
      let UpdateData: any;
      this.timesheetData.forEach((obj: any) => {
        if (obj.date == SheetDate && task_name == obj.task_name) {
          ApiType = 'update';
          UpdateData = obj;
        }
      });

      let Save = {
        date: SheetDate,
        company_name: CompanyID,
        task_name: task_name,
        hours_worked: filterValue,
        emp_id: this.emp_id,
      };
      if (ApiType == 'update') {
        this.timesheetServ.updateItem(UpdateData.key, Save);
      } else {
        this.timesheetServ.addItem(Save);
      }

    }
  }
  saveTimesheet() {
    $('#loading').show();
    let StartDate = this.dates[0];
    let EndDate = this.dates[this.dates.length - 1];
    let currDate = new Date();
    let submitted_at = currDate.getTime();
    let Save = {
      start_date: StartDate.full_date,
      end_date: EndDate.full_date,
      emp_id: this.emp_id,
      manager_id: '',
      status: 1,
      remarks: '',
      submitted_at: submitted_at
    };
    if (this.timesheetSubmissionsLogs && this.timesheetSubmissionsLogs.length) {
      this.timesheetSubmitService.updateItem(this.key_of_timesheet, Save);
      // this.status = '0';
    } else {
      this.timesheetSubmitService.addItem(Save);
      this.retrieveTimesheetSubmissions();
      this.status = '0';
    }
    // setTimeout(function() {
    this.disableAllInputs = true;
    this.displayTimesheetSubmitNotificaiton = true;
    $('#loading').hide();
    // }, 3000);
  }
  submitTimesheet() {
    $('#loading').show();
    let StartDate = this.dates[0];
    let EndDate = this.dates[this.dates.length - 1];
    let currDate = new Date();
    let submitted_at = currDate.getTime();
    let Save = {
      start_date: StartDate.full_date,
      end_date: EndDate.full_date,
      emp_id: this.emp_id,
      manager_id: localStorage.getItem('managerId'),
      status: 0,
      remarks: '',
      submitted_at: submitted_at
    };

    // if (this.timesheetSubmissions && this.timesheetSubmissions.length) {
    // this.timesheetSubmitService.updateItem(this.key_of_timesheet, Save);
    // this.status = '0';
    // } else {
    this.timesheetSubmitService.addItem(Save);
    this.retrieveTimesheetSubmissions();
    this.status = '0';
    //  }
    // setTimeout(function() {
    this.disableAllInputs = true;
    this.displayTimesheetSubmitNotificaiton = true;
    $('#loading').hide();
    // }, 3000);
  }
  prev() {
    let StartDate = this.dates[0];
    let EndDate = this.dates[this.dates.length - 1];
    let currentIndex;
    for (let index = 0; index < this.timesheetSubmissions.length; index++) {
      // if (StartDate.full_date == this.timesheetSubmissions[index].start_date && EndDate.full_date == this.timesheetSubmissions[index].end_date) {
      if (this.key_of_timesheet == this.timesheetSubmissions[index].key) {
        currentIndex = index;
        let dates = this.generate_dates(this.timesheetSubmissions[currentIndex - 1].start_date);
        this.dates = dates;
        this.key_of_timesheet = this.timesheetSubmissions[currentIndex - 1].key;
        this.loadClockitData(this.dates[0].full_date, (this.dates[(this.dates.length - 1)].full_date));
        this.retrieveTimesheet();
        setTimeout(() => {
          this.retrieveTimesheetSubmissions();
        }, 1000);
      }
    }

  }
  next() {
    let StartDate = this.dates[0];
    let EndDate = this.dates[this.dates.length - 1];
    let currentIndex;
    for (let index = 0; index < this.timesheetSubmissions.length; index++) {
      // if (StartDate.full_date == this.timesheetSubmissions[index].start_date && EndDate.full_date == this.timesheetSubmissions[index].end_date) {
      if (this.key_of_timesheet == this.timesheetSubmissions[index].key) {
        currentIndex = index;
        let dates = this.generate_dates(this.timesheetSubmissions[currentIndex + 1].start_date);
        this.dates = dates;
        this.key_of_timesheet = this.timesheetSubmissions[currentIndex + 1].key;
        this.loadClockitData(this.dates[0].full_date, (this.dates[(this.dates.length - 1)].full_date));
        this.retrieveTimesheet();
        setTimeout(() => {
          this.retrieveTimesheetSubmissions();
        }, 1000);
      }
    }
  }
}

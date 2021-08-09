import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { TimesheetSubmission } from 'src/app/entity/timesheetSubmission';
@Injectable()
export class TimesheetSubmissionService {
  headers_object;
  timesheetRef: AngularFireList<TimesheetSubmission>;
  constructor(private http: HttpClient, public db: AngularFireDatabase) {
    this.timesheetRef = db.list('timesheetSubmission');
  }
  getCustomItems(emp_id) {
    const queryObservable = this.db.list('/timesheetSubmission');
    console.log(queryObservable);
  }
  getSingleItem(key) {
    return this.db.list('/timesheetSubmission/'+key);
  }
  addItem(newObj: any) {
    this.timesheetRef.push(newObj);
  }

  updateItem(key: string, newText: {}) {
    this.timesheetRef.update(key, newText);
  }

  deleteUser(key: string) {
    this.timesheetRef.remove(key);
  }

  listData(key, val) {
    // return this.timesheetRef;
    return this.db.list('/timesheetSubmission', ref => ref.orderByChild(key).equalTo(val));
  }

  deleteEverything() {
    //this.itemsRef.remove();
  }

  searchByKey(key,val){
   // console.log(key+'hhh'+val);
   return this.db.list('/timesheetSubmission', ref => ref.orderByChild(key).equalTo(val));
  }

  seacrhUserById(id){
    return this.db.list('/timesheetSubmission', ref => ref.orderByChild('id').equalTo(id));
  }
  seacrhUserByStatus(id){
    //return this.db.list('/users', ref => ref.orderByChild('roleStatus').equalTo(0));
    firebase.database().ref('/timesheetSubmission').orderByChild('roleStatus').equalTo(0).once('value').then(snapshot => {
      snapshot.forEach(child => {
        const post = child.val();
        post.key = child.key;
        return post;
      });
    });
  }

}

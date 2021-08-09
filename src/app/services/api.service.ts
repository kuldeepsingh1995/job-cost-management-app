import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase/app';

@Injectable()
export class ApiService {
  headers_object;
  userRef: AngularFireList<any>;

  constructor(private http: HttpClient,public db: AngularFireDatabase) {
    //let token = localStorage.getItem('accessToken') || null;
    //this.headers_object = new HttpHeaders().set("Authorization", "Bearer " + token);
    this.userRef = db.list('users');
  }

  getRequest(url) {
    return this.http.get(environment.url + url, { headers: this.headers_object });
  }

  deleteRequest(url) {
    return this.http.delete(environment.url + url, { headers: this.headers_object });
  }

  postRequest(url, data) {
    return this.http.post(environment.url + url, data, { headers: this.headers_object });
  }

  updateRequest(url, data) {
    // return this.http.put(environment.baseUrl + 'country/updateCountry/' + id, data);
    return this.http.patch(environment.url + url, data, { headers: this.headers_object });
  }

  uploadImage(url, fileToUpload) {
    const uploadData: FormData = new FormData();
    if (fileToUpload) {
      uploadData.append('file', fileToUpload, fileToUpload.name);
    }
    return this.http.post(environment.url + url, uploadData, { headers: this.headers_object });
  }

  public get getUserFromLocal(): any {
      return JSON.parse(localStorage.getItem('accessToken')); 
  }

  addItem(newName: string) {
    // this.itemsRef.push({ text: newName });
  }

  updateItem(key: string, newText: {}) {
    this.userRef.update(key, newText);
  }

  deleteUser(key: string) {
    this.userRef.remove(key);
  }

  deleteEverything() {
    // this.itemsRef.remove();
  }

  searchByKey(key, val) {
   // console.log(key+'hhh'+val);
   return this.db.list('/users', ref => ref.orderByChild(key).equalTo(val));

  }

  seacrhUserById(id) {
    return this.db.list('/users', ref => ref.orderByChild('id').equalTo(id));
  }

  seacrhUserByStatus(id) {
    // return this.db.list('/users', ref => ref.orderByChild('roleStatus').equalTo(0));
    firebase.database().ref('/users').orderByChild('roleStatus').equalTo(0).once('value').then(snapshot => {
      snapshot.forEach(child => {
        const post = child.val();
        post.key = child.key;
        return post;
      });
    });
  }

  sendEmail(email) {

    const url = 'https://us-central1-jobcostingwebapp.cloudfunctions.net/app?to='+email.to+'&subject='+email.subject+'&mess='+email.mess; 

    //return this.http.post(url);
    return this.http.get(url);
    //return this.http.get(url, { headers: this.headers_object });
  }

}

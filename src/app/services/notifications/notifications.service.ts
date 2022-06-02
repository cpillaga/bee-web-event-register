import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES } from '../../configurations/url.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private _http: HttpClient) { }

  // Obtener Token
  getToken() {
    return localStorage.getItem('token-organizer');
  }

  // POST NOTIFICATION
  postNotification() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
    const url = URL_SERVICES + `organizer/notification`;
    return this._http.post(url, {}, {headers, observe: 'response'});
  }

  // GET NOTIFICATIONS
  getNotification() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
    const url = URL_SERVICES + `organizer/notification`;
    return this._http.get(url, {headers, observe: 'response'});
  }

  // PUT VIEW NOTIFICATIONS
  viewNotifications() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
    const url = URL_SERVICES + `organizer/notification`;
    return this._http.put(url, {}, {headers, observe: 'response'});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICES } from '../configurations/url.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  idOrganizer = localStorage.getItem('idOrganizer');
  
  constructor(private _http: HttpClient) { }

// Obtener Token
  getToken() {
    return localStorage.getItem('token-organizer');
  }

// Servicios de sesión
  getSession() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
    const url = URL_SERVICES + 'organizer/session';
    return this._http.get(url, {headers, observe: 'response'});
  }

  postLogin(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = URL_SERVICES + `organizer/login`;
    
    return this._http.post(url, body, {headers, observe: 'response'});
  }

  logOut() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `organizer/logout`;
    
    return this._http.delete(url, {headers, observe: 'response'});
  }

  getEvent(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + 'event/organizer/' + this.idOrganizer;
    
    return this._http.get(url, {headers, observe: 'response'});
  }

  postEvent(body: FormData){
    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
      Authorization: this.getToken()
    });
    
    const url = URL_SERVICES + `event`;

    return this._http.post(url, body, {headers, observe: 'response'});
  }

  postAdvertising(body){
    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
      Authorization: this.getToken()
    });
    
    const url = URL_SERVICES + `event/promotion`;

    return this._http.post(url, body, {headers, observe: 'response'});
  }

  generateTickets(body){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `ticket/register`;

    return this._http.post(url, body, {headers, observe: 'response'});
  }

  addLocalitiesToEvent(localidades, event){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
  
    let localities = JSON.parse(localidades); 

    console.log(localities);
    const url = URL_SERVICES + `event/add-localities/${event}`;
    
    return this._http.put(url, { localities }, {headers, observe: 'response'});
  }

  getEventById(idEvent){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + 'event-event/' + idEvent;
    
    return this._http.get(url, {headers, observe: 'response'});
  }
}

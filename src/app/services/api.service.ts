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

  getEventByCategory(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = URL_SERVICES + `events/filter/Todos?orderAZ=asc`;

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

  getEventByAvailable(available){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = URL_SERVICES + `event-available/${this.idOrganizer}/${available}`;

    return this._http.get(url, {headers, observe: 'response'});
  }

  postLocalities(body){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
    
    const url = URL_SERVICES + `localities`;

    return this._http.post(url, body, {headers, observe: 'response'});
  }

  getLocalities(idEvent){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + 'localities/' + idEvent;
    
    return this._http.get(url, {headers, observe: 'response'});
  }

  postAdvertising(body){
    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
      Authorization: this.getToken()
    });
    
    const url = URL_SERVICES + `event/promotion`;

    return this._http.post(url, body, {headers, observe: 'response'});
  }

  postOrder(body){
    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
      Authorization: this.getToken()
    });
    
    const url = URL_SERVICES + `organizer/order-event`;

    return this._http.post(url, body, {headers, observe: 'response'});
  }

  generateTicketsSecuencial(body){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `ticket/secuencial`;

    return this._http.post(url, body, {headers, observe: 'response'});
  }

  putStockLocality(body){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
    
    const url = URL_SERVICES + `localities-organizer/stock/${body.idLocality}/${body.quantity}`;

    return this._http.put(url, {}, {headers, observe: 'response'});
  }

  addLocalitiesToEvent(localidades, event){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
  
    let localities = JSON.parse(localidades); 

    const url = URL_SERVICES + `event/add-localities/${event}`;
    
    return this._http.put(url, { localities }, {headers, observe: 'response'});
  }

  getEventById(idEvent){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + 'event/' + idEvent;
    
    return this._http.get(url, {headers, observe: 'response'});
  }

  filterEvent(word){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + 'events/filter-events/' + this.idOrganizer + '/' + word;
    
    return this._http.get(url, {headers, observe: 'response'});
  }
  
  getStories(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `shop/story/uploader/${this.idOrganizer}`;
    
    return this._http.get(url, {headers, observe: 'response'});
  }

  saveStories(body: FormData){
    const headers = new HttpHeaders({
      enctype: 'multipart/form-data',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `shop/story`;
    
    return this._http.post(url,  body , {headers, observe: 'response'});
  }

  deleteStories(idStory){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `shop/story/${idStory}`;
    
    return this._http.delete(url, {headers, observe: 'response'});
  }

  getTotalEvent(desde, hasta) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `event/orders/total/${desde}/${hasta}`;

    return this._http.get(url, { headers, observe: 'response' });
  }

  getDetailTickets(idEvent){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });

    const url = URL_SERVICES + `event/orders/sold/localities/total/${idEvent}`;

    return this._http.get(url, { headers, observe: 'response' });
  }

  getReportEvent(id, desde, hasta){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken()
    });
 
    const url = URL_SERVICES + `event/orders/sold/localities/total/${id}/${desde}/${hasta}`;

    return this._http.get(url, { headers, observe: 'response' });
  }


}

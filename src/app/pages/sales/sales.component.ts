import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { URL_SERVICES } from '../../configurations/url.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  events;
  coincidencia = false;
  url = URL_SERVICES;

  constructor(
    public _api: ApiService
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents(){
    this.events = null;
    this._api.getEvent().subscribe(resp => {
      this.events = resp.body['eventDB'];

      if(this.events.length > 0){
        this.coincidencia = true;
      }else{
        this.coincidencia = false;
      }
    });
  }

  filterEvent(word){
    this.events = null;
    if (word == '') {
      this.getEvents();
    }else{
      this._api.filterEvent(word).subscribe(resp => {
        this.events = resp.body['list'];
      });
    }
  }
}

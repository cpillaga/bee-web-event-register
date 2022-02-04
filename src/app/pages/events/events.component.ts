import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { URL_SERVICES } from '../../configurations/url.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events;
  coincidencia = false;
  url = URL_SERVICES;

  constructor(
    private _api: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getEvent();
  }

  getEvent(){
    this._api.getEvent().subscribe(resp => {
      console.log(resp.body['eventDB']);
      this.events = resp.body['eventDB'];
      if(this.events.length > 0){
        this.coincidencia = true;
      }else{
        this.coincidencia = true;
      }
    });
  }

}

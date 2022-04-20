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
  status = 'PENDIENTE';

  constructor(
    private _api: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getEvent(this.status);
  }

  getEvent(available){
    console.log("Entrooooooooooo");
    console.log(available);
    this.events = null;
    this.status = available;
    this._api.getEventByAvailable(available).subscribe(resp => {
      console.log(resp);
      this.events = resp.body['eventDB'];

      if(this.events.length > 0){
        this.coincidencia = true;
      }else{
        this.coincidencia = false;
      }
    });
  }

  filterEvent(word, available){
    if (word == '') {
      this.getEvent(available);
    }else{
      this._api.filterEvent(word).subscribe(resp => {
        this.events = resp.body['list'];

        if(this.events.length > 0){
          this.coincidencia = true;
        }else{
          this.coincidencia = false;
        }
      });
    }
  }

 
}

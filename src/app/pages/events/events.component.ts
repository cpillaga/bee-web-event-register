import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events;

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit() {
    this.getEvent();
  }

  getEvent(){
    this._api.getEvent().subscribe(resp => {
      console.log(resp);
      // this.events = resp;
    });
  }
}

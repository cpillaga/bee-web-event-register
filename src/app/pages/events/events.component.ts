import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events;
  coincidencia = false;

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit() {
    this.getEvent();
  }

  getEvent(){
    this._api.getEvent().subscribe(resp => {
      console.log(resp);
      this.events = resp;
      if(this.events.length > 0){
        this.coincidencia = true;
      }else{
        this.coincidencia = true;
      }
    });
  }
}

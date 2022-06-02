import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { URL_SERVICES } from '../../configurations/url.service';
import { Event } from 'typescript.events';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  shop: any;
  url = URL_SERVICES;

  constructor(private _api: ApiService, private event: Event) {
    this.getSession();
  }

  ngOnInit() {}

  // DATOS DE SESIÓN
  getSession() {
    this._api.getSession().subscribe((data: any) => {
      this.shop = data.body.shop;
    }, (err) => {
      console.log(err);
    });
  }


}

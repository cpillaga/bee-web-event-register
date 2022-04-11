import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import * as moment from 'moment';
import { URL_SERVICES } from '../../configurations/url.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  date = moment();
  desde: string;
  hasta: string;
  a = (this.date.format('YYYY') + "/" + this.date.format('MM') + "/" + 1);

  url = URL_SERVICES;
  events: any[] = [];

  constructor(
    private _api: ApiService,
  ) { }

  ngOnInit() {
    console.log(this.desde);
    console.log(this.hasta);
    
    this.desde = moment(this.a).format('YYYY-MM-DD');
    this.hasta = moment().format('YYYY-MM-DD');

    let fechas = {
      value: {
        desde: this.desde,
        hasta: this.hasta,
        buscar: ''
      }
    };

    this.searchEvents(fechas);
  }


  searchEvents(buscar){
    if (buscar.value.desde > buscar.value.hasta) {
      this.showAlert('error', 'Error', 'Fecha desde debe ser menor a fecha hasta', 'btn btn-primary');
    }else{
      
      if (buscar.value.buscar == '') {
        this._api.getTotalEvent(buscar.value.desde, buscar.value.hasta).subscribe(resp => {
          this.events = resp.body['list'];
        });
      }else{
        this._api.getTotalEvent(buscar.value.desde, buscar.value.hasta).subscribe(resp => {
          let eventAux = resp.body['list'];
          this.events = [];

          eventAux.forEach(element => {
            if (element.event['nameEvent'].toLowerCase().includes((buscar.value.buscar.toLowerCase()))) {
               this.events.push(element);
            }
          });
        });
      }
    }
  }

  showAlert(type, title, text, classBtn) {
    swal.fire({
      title,
      text,
      type,
      buttonsStyling: false,
      confirmButtonClass: classBtn
    });
  }
}

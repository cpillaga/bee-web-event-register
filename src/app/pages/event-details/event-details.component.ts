import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  idEvt;
  event;
  localities;

  total = 0;
  
  selectCants: any[] = [];
  selectSubtotal: any[] = [];
  

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private _api: ApiService
  ) {
    this.idEvt = this.route.snapshot.paramMap.get("idEvent");
  }

  ngOnInit() {
    this.getEventById();
  }

  getEventById(){
    this._api.getEventById(this.idEvt).subscribe(resp => {
      console.log(resp.body['eventDB']);
      this.event = resp.body['eventDB'];
      this.localities = this.event.localities;

      for (let i = 0; i < this.localities.length; i++) {
        console.log("Entro " + i);

        this.selectCants[i] = 0;
        this.selectSubtotal[i] = 0;
      }
    });
  }

  facturar(){

  }

  cantButton(opt, index){
    if (opt === "+") {
      let valor = Number(Number(this.selectCants[index]) + Number(1));
      this.cambiarCants(valor, index);
    }else{
      let valor = (this.selectCants[index] - Number(1));
      
      if (valor >= 0 ) {
        this.cambiarCants(valor, index);
      }else{
        this.showAlert('error', 'Error', 'No se puede tener items menores a 0', 'btn btn-primary');
      }
    }
  }
  
  cambiarCants(valor, index){
    this.total = 0;
    valor = Number(valor);
    if(this.localities[index].stock < valor){
      this.showAlert('error', 'Error', `Existen solo ${this.localities[index].stock} en stock`, 'btn btn-primary');
      
      valor = this.localities[index].stock;

      this.selectCants[index] = valor;
      this.selectSubtotal[index] = valor * this.localities[index].price;
      for (let i = 0; i < this.localities.length; i++) {
        this.total = this.total + this.selectSubtotal[i];
      }
      return;
    }else{
      this.selectCants[index] =  valor;
      this.selectSubtotal[index] = valor * this.localities[index].price;
      for (let i = 0; i < this.localities.length; i++) {
        this.total = this.total + this.selectSubtotal[i];
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
    }).then((_) => {
      // this.closeDialog();
    });
  }

}

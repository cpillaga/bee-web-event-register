import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  idEvt;
  event;
  localities;

  coincidencia = false;

  subtotal = 0;
  iva = 0;
  total = 0;
  
  selectCants: any[] = [];
  selectSubtotal: any[] = [];
  

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private _api: ApiService,
    private socketService: SocketService
  ) {
    this.idEvt = this.route.snapshot.paramMap.get("idEvent");
  }

  ngOnInit() {
    this.getEventById();
  }

  getEventById(){
    this._api.getEventById(this.idEvt).subscribe(resp => {
      this.event = resp.body['eventDB'];
       
      this.getDetailEvent(this.event._id);
    });
  }

  getDetailEvent(idEvent){
    this._api.getLocalities(idEvent).subscribe(resp => {
      this.localities = resp.body['locality'];
      
      if (this.localities.length > 0) {
        this.coincidencia = true;
      }

      for (let i = 0; i < this.localities.length; i++) {
        this.selectCants[i] = 0;
        this.selectSubtotal[i] = 0;
      }
    });
  }

  verifyStock(){
    this._api.getLocalities(this.event._id).subscribe(resp => {
      this.localities = resp.body['locality'];

      let contStock = 0;
      
      for (let i = 0; i < this.localities.length; i++) {
        if (this.localities[i].stock >= this.selectCants[i]) {
          if (contStock === (this.localities.length - 1)) {
            this.facturar();
          }

          contStock = contStock + 1;
        }else{
          this.showAlert('error', `Error en ${this.localities[i].description}`, `Solo existe ${this.localities[i].stock} en stock `, 'btn btn-primary');          
        }
      }
    });
  }

  facturar(){
    let order = {
      event: this.localities[0].event,
      orderSubtotal: this.subtotal,
      orderTotal: this.total,
      orderIva: this.iva,
      statusBuy: false,
    };

    this._api.postOrder(order).subscribe(resp => {
      let cont = 0;
      let sum = 0;
      
      for (let i = 0; i < this.localities.length; i++) {
        let body = {
          idLocality: this.localities[i]._id,
          quantity: this.selectCants[i]
        }

        this._api.putStockLocality(body).subscribe(locality => {
          if (locality.status === 200) {
            sum = sum + this.selectCants[i];
            for (let j = 0; j < this.selectCants[i]; j++) {
              let ticket = {
                digital: false,
                locality: this.localities[i]._id,
                customer: resp.body['orderEvent'].customer,
                orderEvent: resp.body['orderEvent']._id,
              };
    
              this._api.generateTicketsSecuencial(ticket).subscribe(respTicket => {
                if (respTicket.status === 200) {
                  cont = cont + 1;

                  if (cont === sum) {
                    this.showAlert('success', 'Exito', 'Se generó el ticket', 'btn btn-primary');
                    this.getEventById();
                  }
                }
              });
            }
          }
        });
      }
    });
     
  }

  cantButton(opt, index){
    if (opt === "+") {
      let valor = Number(Number(this.selectCants[index]) + Number(1));
      this.cambiarCants(valor, index);
    }else{
      let valor = (this.selectCants[index] - Number(1));
      
      console.log(valor);
      if (valor >= 0 ) {
        this.cambiarCants(valor, index);
      }else{
        this.showAlert('error', 'Error', 'No se puede tener items menores a 0', 'btn btn-primary');
      }
    }
  }
  
  cambiarCants(valor, index){
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0;

    valor = Number(valor);
    if(this.localities[index].stock < valor){
      this.showAlert('error', 'Error', `Existen solo ${this.localities[index].stock} en stock`, 'btn btn-primary');
      
      valor = this.localities[index].stock;

      this.selectCants[index] = valor;
      this.selectSubtotal[index] = valor * this.localities[index].price;

      for (let i = 0; i < this.localities.length; i++) {
        this.subtotal = this.subtotal + this.selectSubtotal[i];
      }

      this.total = Number(Number(this.subtotal * 1.12).toFixed(2));
      this.iva = Number(Number(this.total - this.subtotal).toFixed(2));
      return;
    }else{
      this.selectCants[index] =  valor;
      this.selectSubtotal[index] = valor * this.localities[index].price;
      for (let i = 0; i < this.localities.length; i++) {
        this.subtotal = this.subtotal + this.selectSubtotal[i];
      }

      this.total = Number(Number(this.subtotal * 1.12).toFixed(2));
      this.iva = Number(Number(this.total - this.subtotal).toFixed(2));
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
      // window.location.reload();
    });
  }

}

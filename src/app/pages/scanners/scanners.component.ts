import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-scanners',
  templateUrl: './scanners.component.html',
  styleUrls: ['./scanners.component.scss']
})
export class ScannersComponent implements OnInit {
  scanners: any[] = [];
  scannerForm: FormGroup;
  closeModal: string;

  constructor(
    private _api: ApiService,
    private _formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getScanners();
  }
  
  createForm(){
    this.scannerForm = this._formBuilder.group({
      name: ['', Validators.required],
      phone: ['09', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      password: ['', Validators.required]
    });
  }

  getScanners(){
    this._api.getScanners().subscribe(resp => {
      console.log(resp);
      this.scanners = resp.body['list'];
    });
  }

  searchScanners(termino: string){
    if (termino === '') {
      this.getScanners();
    }else{
      this._api.searchScanners(termino).subscribe(resp => {
        this.scanners = resp.body['list'];
      });
    }
  }

  postScanners(){
    this.scannerForm.value.organizer = localStorage.getItem('idOrganizer');

    this._api.postScanners(this.scannerForm.value).subscribe(resp => {
      if (resp.status === 200) {
        this.showAlert('success', 'Success', 'Se ha agregado correctamente el escáner', 'btn btn-success');
        this.getScanners();
      }
    });
  }

  triggerModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
        this.closeModal = `Closed with: ${res}`;
    }, (res) => {
        this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });  
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
    } else {
        return  `with: ${reason}`;
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

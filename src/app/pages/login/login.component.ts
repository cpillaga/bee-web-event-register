import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import {FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../../services/api.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  date: Date = new Date();
  focus;
  focus1;
  registerForm: FormGroup;
  submitted = false;
  loading = false;

  recoverPasswordModal: BsModalRef;
  styleModal = {
    keyboard: true,
    class: 'modal-dialog-centered'
  };

  constructor(
    private modalService: BsModalService,
    private _formBuilder: FormBuilder,
    public router: Router,
    private _api: ApiService
  ) {}

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('bg-default');
    const navbar = document.getElementsByClassName('navbar-horizontal')[0];
    navbar.classList.add('navbar-light');
    navbar.classList.add('navbar-transparent');
    this.createForm();
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('bg-default');
    const navbar = document.getElementsByClassName('navbar-horizontal')[0];
    navbar.classList.remove('navbar-light');
    navbar.classList.remove('navbar-transparent');
  }

  createForm() {
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      password: ['', Validators.required]
    });
  }

  get errorsForm() { return this.registerForm.controls; }

  login() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this._api.postLogin(this.registerForm.value).subscribe((data: any) => {
      if (data.status === 200) {
        localStorage.setItem('idOrganizer', data.body.shop["_id"]);
        localStorage.setItem('token-organizer', data.body.token);
        this.loading = false;
        this.router.navigate(['/home']);
      }
    }, (_) => {
      this.showAlert('error', 'Error', 'Correo o contraseña icorrectos!', 'btn btn-primary');
      this.loading = false;
    });
  }

  openRecoverPassword(modalDefault: TemplateRef<any>) {
    this.recoverPasswordModal = this.modalService.show(modalDefault, this.styleModal);
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

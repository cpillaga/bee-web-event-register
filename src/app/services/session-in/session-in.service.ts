import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SessionInService {

  constructor(private router: Router,
    private _api: ApiService) { }

  getSession() {
    return new Promise((res) => {
      this._api.getSession().subscribe((_) => {
        res(false);
      }, (_) => {
        res(true);
      });
    });
  }

  async canActivate() {
    const response = await this.getSession();
    if (response) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
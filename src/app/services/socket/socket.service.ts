import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { URL_WEBSOCKET } from '../../configurations/url.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: io;
  status: boolean;

  constructor() { }

  socketConnect(token: string) {
    this.socket = io(`${URL_WEBSOCKET}/shop-user`, {query: `token=${token}`});
  }

  socketMessage() {
    return this.socket;
  }

  socketClose() {
    return this.socket.close();
  }
}

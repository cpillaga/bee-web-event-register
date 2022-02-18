import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket/socket.service';
import { Event } from 'typescript.events';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { ToastrService } from 'ngx-toastr';

const misc: any = {
  sidebar_mini_active: true
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}

export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/home',
    title: 'Inicio',
    type: 'link',
    icontype: 'fa fa-home text-info'
  },
  {
    path: '/event',
    title: 'Eventos',
    type: 'link',
    icontype: 'fa fa-tags text-primary'
  },
  {
    path: '/stories',
    title: 'Historias',
    type: 'link',
    icontype: 'fa fa-tags text-yellow'
  },
  {
    path: '/resume',
    title: 'Resumen',
    type: 'link',
    icontype: 'fa fa-chart-pie text-default'
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  total;

  constructor(private router: Router,
    private socketService: SocketService,
    private _api: NotificationsService,
    public toastr: ToastrService,
    public event: Event) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
    this.getNotifications();
    this.socketService.socketConnect(localStorage.getItem('token-shop'));
    this.socketData();
  }

  socketData() {
    this.socketService.socketMessage().on('order', () => {
      this._api.postNotification().subscribe((data: any) => {
        this.showNotification();
        this.event.emit('new order');
        this.total = data.body.total;
      });
    });
  }

  getNotifications() {
    this._api.getNotification().subscribe((data: any) => {
      this.total = data.body.total;
      for (let i = 0; i < this.total; i++) {
        this.showNotification();
      }
    });
  }

  viewNotifications() {
    this.toastr.clear();
    this._api.viewNotifications().subscribe((data: any) => {
      this.total = data.body.total;
    });
  }

  showNotification() {
    this.toastr.show(
      '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Nueva Orden</span> <span data-notify="message">Tienes una nueva orden pendiente</span></div>',
      '',
      {
        extendedTimeOut: 0,
        timeOut: 0,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: 'alert-title',
        positionClass: 'toast-top-center',
        toastClass:
          'ngx-toastr alert alert-dismissible alert-default alert-notify'
      }
    );
  }

  onMouseEnterSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.add('g-sidenav-show');
    }
  }

  onMouseLeaveSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  }

  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      'sidenav-toggler'
    )[0];
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('g-sidenav-pinned')) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove('g-sidenav-pinned');
      body.classList.add('g-sidenav-hidden');
      sidenavToggler.classList.remove('active');
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add('g-sidenav-pinned');
      body.classList.remove('g-sidenav-hidden');
      sidenavToggler.classList.add('active');
      misc.sidebar_mini_active = true;
    }
  }
}

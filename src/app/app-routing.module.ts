import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { SessionInService } from './services/session-in/session-in.service';
import { SessionOutService } from './services/session-out/session-out.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [SessionInService]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [SessionOutService],
    children: [
      {
        path: 'home',
        loadChildren: './pages/home/home.module#HomeModule'
      },
      {
        path: 'event',
        loadChildren: './pages/events/events.module#EventsModule'
      },
      {
        path: 'new-event',
        loadChildren: './pages/new-event/new-event.module#NewEventModule'
      },
      {
        path: 'new-event/:idEvent',
        loadChildren: './pages/new-event/new-event.module#NewEventModule'
      },
      {
        path: 'resume',
        loadChildren: './pages/resume/resume.module#ResumeModule'
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
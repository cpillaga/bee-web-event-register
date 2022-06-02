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
        path: 'eventDetail/:idEvent',
        loadChildren: './pages/event-details/event-details.module#EventDetailsModule'
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
        path: 'sales',
        loadChildren: './pages/sales/sales.module#SalesModule'
      },
      {
        path: 'scanners',
        loadChildren: './pages/scanners/scanners.module#ScannersModule'
      },
      {
        path: 'stories',
        loadChildren: './pages/story/story.module#StoryModule'
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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

import { HomeRoutes } from './home.routing';
import { RouterModule } from '@angular/router';
import { Event } from 'typescript.events';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes)
  ],
  providers: [
    Event
  ]
})
export class HomeModule { }

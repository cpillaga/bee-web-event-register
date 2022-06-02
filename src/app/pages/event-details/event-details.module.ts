import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from './event-details.component';
import { EventDetailsRoutes } from './event-detail.routing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(EventDetailsRoutes),
    FormsModule,
  ]
})
export class EventDetailsModule { }

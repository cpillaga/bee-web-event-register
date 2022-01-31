import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';

import { EventsRoutes } from './events.routing';
import { RouterModule } from '@angular/router';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TabsModule.forRoot(),
    RouterModule.forChild(EventsRoutes),
  ],
  exports: [
    EventsComponent
  ],
  bootstrap: [
    EventsComponent
  ]
})
export class EventsModule { }

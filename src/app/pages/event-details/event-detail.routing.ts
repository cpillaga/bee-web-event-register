import { Routes } from '@angular/router';
import { EventDetailsComponent } from './event-details.component';

export const EventDetailsRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: EventDetailsComponent
    }]
}]
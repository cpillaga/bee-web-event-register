import { Routes } from '@angular/router';
import { NewEventComponent } from './new-event.component';

export const NewEventRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: NewEventComponent
    }]
}]
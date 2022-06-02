import { Routes } from '@angular/router';
import { ScannersComponent } from './scanners.component';

export const ScannerRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: ScannersComponent
    }]
}]
import { Routes } from '@angular/router';
import { ResumeComponent } from './resume.component';

export const ResumeRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: ResumeComponent
    }]
}]
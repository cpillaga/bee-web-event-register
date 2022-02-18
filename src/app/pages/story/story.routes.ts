import { Routes } from '@angular/router';
import { StoryComponent } from './story.component';

export const StoryRoutes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: StoryComponent
    }]
}]
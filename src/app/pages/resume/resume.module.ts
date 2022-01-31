import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeComponent } from './resume.component';
import { RouterModule } from '@angular/router';
import { ResumeRoutes } from './resume.routes';

@NgModule({
  declarations: [
    ResumeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ResumeRoutes)
  ]
})
export class ResumeModule { }

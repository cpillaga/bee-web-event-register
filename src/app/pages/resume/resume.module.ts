import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeComponent } from './resume.component';
import { RouterModule } from '@angular/router';
import { ResumeRoutes } from './resume.routes';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    ResumeComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    MatDialogModule,
    TabsModule.forRoot(),
    RouterModule.forChild(ResumeRoutes)
  ],
  exports: [
    ResumeComponent
  ],
  bootstrap: [
    ResumeComponent
  ]
})
export class ResumeModule { }

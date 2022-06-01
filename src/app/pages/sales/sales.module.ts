import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';

import { SalesRoutes } from './sales.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SalesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SalesRoutes)
  ],
})
export class SalesModule { }

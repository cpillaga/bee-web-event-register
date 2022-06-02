import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannersComponent } from './scanners.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDialogModule } from '@angular/material/dialog';
import { TabsModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { ScannerRoutes } from './scanners.routes';



@NgModule({
  declarations: [
    ScannersComponent
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
    RouterModule.forChild(ScannerRoutes)
  ],
  exports: [
    ScannersComponent
  ]
})
export class ScannersModule { }

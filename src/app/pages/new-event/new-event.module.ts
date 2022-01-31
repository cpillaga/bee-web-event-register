import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewEventComponent } from './new-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterModule } from '@angular/router';
import { NewEventRoutes } from './new-event.routing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    NewEventComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    FileUploadModule,
    ComponentsModule,
    TabsModule.forRoot(),
    RouterModule.forChild(NewEventRoutes),
    MatStepperModule,
    NgxDropzoneModule,
  ],
  exports: [
    NewEventComponent
  ],
  bootstrap: [
    NewEventComponent
  ],
  providers:[
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true }
    }
  ]
})
export class NewEventModule { }

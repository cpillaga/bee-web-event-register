import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryComponent } from './story.component';
import { StoryRoutes } from './story.routes';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [
    StoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(StoryRoutes),
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    FileUploadModule,
    NgxDropzoneModule
  ],
  exports: [
    StoryComponent
  ],
  bootstrap: [
    StoryComponent
  ],
})
export class StoryModule { }

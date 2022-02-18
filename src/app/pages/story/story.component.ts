import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { URL_SERVICES } from '../../configurations/url.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  loading = false;
  fileUploadControl;
  formImg: FormGroup;
  files: File[] = [];
  controlAccept = 'image/*';
  controlOpt = 'imagen';
  imgStory;
  url = URL_SERVICES;
  stories = new FormData();
  extension: any[];

  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;

  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(1));
  
  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.formImg = this._formBuilder.group({
      img: [this.filesControl],
      imgName: ['', [Validators.required]]
    });

    this.getStories();
  }
  
  showAlert(type, title, text, classBtn) {
    swal.fire({
      title,
      text,
      type,
      buttonsStyling: false,
      confirmButtonClass: classBtn
    }).then((_) => {
      // this.closeDialog();
    });
  }

  getStories(){
    this.stories = new FormData();
    this.loading = false;
    this._api.getStories().subscribe(resp => {
      this.imgStory = resp.body['list']; 
    });
  }

  deleteStories(id){
    this._api.deleteStories(id).subscribe(resp => {
      this.getStories();
    });
  }

  
  saveStories(){
    this.loading = true;
    let idOrganizer = localStorage.getItem('idOrganizer');

    this.stories.append('type', 'Organizador');
    this.stories.append('fileType', this.controlOpt);
    this.stories.append('img', this.formImg.value.img.value[0]);
    this.stories.append('uploadBy', idOrganizer);
  
    this._api.saveStories(this.stories).subscribe(resp => {

      if (resp.status === 200) {
        this.closebuttonadd.nativeElement.click();
        this.reset();
        this.getStories();
      }else{
        console.log("Error");
      }
    }, (err)=> {
      console.log(err);
    });
  }

  // GETTERS VALIDATORS
  get img() {
    return this.formImg.get('img');
  }

  get imgName() {
    return this.formImg.get('imgName');
  }

  reset() {
    this.formImg.reset();
    this.files.splice(0, 1);
  }

  onSelect(event) {
    if (event.addedFiles.length == 0) {
      if (this.controlOpt == 'imagen') {
        this.showAlert('error', 'Error', `Debe ingresar archivos de tipo ${this.controlOpt}`, 'btn btn-primary');
      }else{
        this.showAlert('error', 'Error', `Debe ingresar archivos de tipo ${this.controlOpt} ó máximo 14 segundos`, 'btn btn-primary');
      }
    }else{
      this.files[0] = (event.addedFiles);
      console.log(event);
      this.filesControl = new FormControl(this.files[0], FileUploadValidators.filesLimit(1));
      
      this.formImg = this._formBuilder.group({
        img: [this.filesControl],
        imgName: ['tiene valor']
      });
    }
	}

	onRemove(event) {
		this.files.splice(this.files.indexOf(event), 1);
    this.filesControl = new FormControl('', FileUploadValidators.filesLimit(1));
    
    this.formImg = this._formBuilder.group({
      img: [this.filesControl],
      imgName: ['']
    });
	}

  cambiarOpt(opt: string){
    this.controlOpt = opt;
    
    if (opt == 'imagen') {
      this.controlAccept = 'image/*';
    }else{
      this.controlAccept = 'video/*';
    }
  }
}

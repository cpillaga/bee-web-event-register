import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import * as mapboxgl from 'mapbox-gl';
import * as moment from 'moment';
import { Localidades } from 'src/app/models/localidades';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit {
  category = "";
  active: string[] = [];
  organizer = localStorage.getItem('idOrganizer');;

  categories: any[] = []; 
  
  categoryFormGroup: FormGroup;
  eventFormGroup: FormGroup;
  extraFormGroup: FormGroup;
  imgFormGroup: FormGroup;
  imgAdvFormGroup: FormGroup;
  mapFormGroup: FormGroup;
  priceFormGroup: FormGroup;
  newLocalities: FormGroup;

  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(1));
  private filesAdvControl = new FormControl(null, FileUploadValidators.filesLimit(1));

  files: File[] = [];
  filesAdv: File[] = [];

  event = new FormData();
  eventAdv = new FormData();

  marker;
  mapa: mapboxgl.Map;
  vector;
  existMarker = false;
  
  coordinates;
  
  cont: any[] = [];

  localities: Localidades;
  listLocalities: Localidades[] = [];

  tickets: any[] = [];

  idEvt;
  eventData;

  @Output() enviarLocalidad = new EventEmitter<Localidades>();


  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _toastr: ToastrService,
    public route: ActivatedRoute
  ) {
    this.idEvt = this.route.snapshot.paramMap.get("idEvent");
  }

  ngOnInit() {
    this.categories = [
      {
        name: 'Entretenimiento'
      },
      {
        name: 'Formación Personal' 
      },
      {
        name: 'Concierto'
      },
      {
        name: 'Turismo'
      },
      {
        name: 'Deporte'
      },
      {
        name: 'Cultura'
      },
      {
        name: 'Otros'
      }
    ];

    if (this.idEvt) {
        this._api.getEventById(this.idEvt).subscribe(resp => {
          this.eventData = resp.body['eventDB'];
          
          console.log(this.eventData);
          
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].name === this.eventData.category) {
              this.selectCategory(this.categories[i], i);
            }
          }

          this.eventFormGroup = this._formBuilder.group({
            nameEvent: [this.eventData.nameEvent, [Validators.required]],
            description: [this.eventData.description, [Validators.required]],
            city: [this.eventData.city, [Validators.required]],
            place: [this.eventData.place, [Validators.required]],
            date: [this.eventData.date.substring(0, 10), [Validators.required]],
            startTime: [this.eventData.startTime.substring(11, 16), [Validators.required]],
            endTime: [this.eventData.endTime.substring(11, 16), [Validators.required]],
            isAllPublic: [this.eventData.isAllPublic, [Validators.required]],
          });

          this.priceFormGroup = this._formBuilder.group({
            isFree: [this.eventData.isFree, [Validators.required]],
            ageChildren: [this.eventData.ageChildren],
            discountDisability: [this.eventData.discountDisability],
            discountChildren: [this.eventData.discountChildren],
            percentageChildren: [this.eventData.percentageChildren],
            percentageDisability: [this.eventData.percentageDisability],
          });

          this.extraFormGroup = this._formBuilder.group({
            openingHours: [this.eventData.openingHours, [Validators.required]],
            hasParking: [this.eventData.hasParking, [Validators.required]],
            existRequirements: [this.eventData.existRequirements, [Validators.required]],
            requirementsDescription: [this.eventData.requirementsDescription],
            parkingNumber: [this.eventData.parkingNumber],
          });

          this.mapFormGroup = this._formBuilder.group({
            lat: [this.eventData.lat, [Validators.required]],
            lng: [this.eventData.lng, [Validators.required]],
          });

          let filesControl1 = new FormControl(this.eventData.img, FileUploadValidators.filesLimit(1));

          this.imgFormGroup = this._formBuilder.group({
            img: [this.filesControl],
            imgName: ['', [Validators.required]]
          });
        });
    }else{
      this.categoryFormGroup = this._formBuilder.group({
        categoria: ['', [Validators.required, Validators.minLength(1)]]
      });
  
      this.eventFormGroup = this._formBuilder.group({
        nameEvent: ['', [Validators.required]],
        description: ['', [Validators.required]],
        city: ['', [Validators.required]],
        place: ['', [Validators.required]],
        date: ['', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
        isAllPublic: ['', [Validators.required]],
      });
  
      this.priceFormGroup = this._formBuilder.group({
        isFree: ['', [Validators.required]],
        ageChildren: [''],
        discountDisability: [''],
        discountChildren: [''],
        percentageChildren: [''],
        percentageDisability: [''],
      });
  
      this.extraFormGroup = this._formBuilder.group({
        openingHours: ['', [Validators.required]],
        hasParking: ['', [Validators.required]],
        existRequirements: ['', [Validators.required]],
        requirementsDescription: [''],
        parkingNumber: [''],
      });
  
      this.mapFormGroup = this._formBuilder.group({
        lat: ['', [Validators.required]],
        lng: ['', [Validators.required]],
      });
  
      this.imgFormGroup = this._formBuilder.group({
        img: [this.filesControl],
        imgName: ['', [Validators.required]]
      });
  
      this.imgAdvFormGroup = this._formBuilder.group({
        img: [this.filesControl],
        imgName: ['']
      });
  
      this.newLocalities = this._formBuilder.group({
        description: ['', [Validators.required]],
        price: ['', [Validators.required]],
        type: ['', [Validators.required]],
        quantity:  ['', [Validators.required]],
        rows:  ['', [Validators.required]],
        cols: ['', [Validators.required]],
        tickets: this._formBuilder.array([])
      }); 
    }

    this.getCategories();
  }

  getCategories(){
      for (let i = 0; i < this.categories.length; i++) {
        this.active[i] = 'inactive';
      }
  }

  selectCategory(cat, index){
    this.category = cat.name;
    this.categoryFormGroup = this._formBuilder.group({
      categoria: [cat.name, [Validators.required, Validators.minLength(1)]]
    });

    for (let i = 0; i < this.categories.length; i++) {
       if(i == index){
          this.active[i] = 'active';
       } else{
          this.active[i] = 'inactive';
       } 
    }
  }
  
  // SET LAT LNG
  setLatLng(coors: any) {
    this.mapFormGroup.patchValue({ lat: coors.lat });
    this.mapFormGroup.patchValue({ lng: coors.lng });
  }

  postEvent(){
    const fecha = moment(this.eventFormGroup.value.date).format('YYYY-MM-DD');
    const startTimeA = this.eventFormGroup.value.startTime;
    const endTimeA = this.eventFormGroup.value.endTime;

    const startDate = fecha+"T"+startTimeA+":00.000Z";
    const endDate = fecha+"T"+endTimeA+":00.000Z";

    if (this.priceFormGroup.value.isFree == 'false'){
      this.priceFormGroup.value.discountChildren = 'false';
      this.priceFormGroup.value.discountDisability = 'false';
      this.priceFormGroup.value.ageChildren = '0';
    }

    if (this.priceFormGroup.value.discountChildren == 'false') {
      this.priceFormGroup.value.percentageChildren = 0;
    }

    if (this.priceFormGroup.value.discountDisability == 'false') {
      this.priceFormGroup.value.percentageDisability = 0;
    }

    this.event.append('category', this.categoryFormGroup.value.categoria);
    this.event.append('nameEvent', this.eventFormGroup.value.nameEvent);
    this.event.append('description', this.eventFormGroup.value.description);
    this.event.append('city', this.eventFormGroup.value.city);
    this.event.append('place', this.eventFormGroup.value.place);
    this.event.append('date', this.eventFormGroup.value.date);
    this.event.append('startTime',  startDate);
    this.event.append('endTime', endDate);
    this.event.append('isAllPublic', this.eventFormGroup.value.isAllPublic);
    this.event.append('lat', this.mapFormGroup.value.lat);
    this.event.append('lng', this.mapFormGroup.value.lng);
    this.event.append('isFree', this.priceFormGroup.value.isFree);
    this.event.append('ageChildren', this.priceFormGroup.value.ageChildren);
    this.event.append('discountDisability', this.priceFormGroup.value.discountDisability);
    this.event.append('discountChildren', this.priceFormGroup.value.discountChildren);
    this.event.append('percentageChildren', this.priceFormGroup.value.percentageChildren);
    this.event.append('percentageDisability', this.priceFormGroup.value.percentageDisability);
    this.event.append('existRequirements', this.extraFormGroup.value.existRequirements);
    this.event.append('requirementsDescription', this.extraFormGroup.value.requirementsDescription);
    this.event.append('hasParking', this.extraFormGroup.value.hasParking);
    this.event.append('openingHours', this.extraFormGroup.value.openingHours);
    this.event.append('parkingNumber', this.extraFormGroup.value.parkingNumber);
    this.event.append('img', this.imgFormGroup.value.img.value[0]);
    this.event.append('organizer', this.organizer);

    this._api.postEvent(this.event).subscribe(resp => {
      if (resp.status === 200) {
        console.log(resp.body);
        // this.postAdvertising(resp.body['envent']._id);
        this.generateTicket(resp.body['event']._id);
      }
    });
  }

  postAdvertising(idEvent){
    console.log(this.filesAdv);

    for (let i = 0; i < this.filesAdv.length; i++) {
      this.eventAdv.append('advertising', this.filesAdv[i][0]);
      this.eventAdv.append('event', idEvent);
        
      this._api.postAdvertising(this.eventAdv).subscribe(resp => {
        console.log(resp);
      });
    }
    // this.imgAdvFormGroup 
  }

  generateTicket(event){
    for (let i = 0; i < this.listLocalities.length; i++) {
      if (this.listLocalities[i].type == 'Secuencial') {
        let body = {
          event: event,
          quantity: this.listLocalities[i].quantity,
        }

        this._api.generateTickets(body).subscribe(resp => {
          if (resp.status === 200) {
            console.log(resp.body['ticket']);
            this.tickets = resp.body['ticket'];
            this.listLocalities[i].tickets = this.tickets;

            delete this.listLocalities[i].rows;
            delete this.listLocalities[i].cols;
            delete this.listLocalities[i].quantity;
            delete this.listLocalities[i].hide;
            delete this.listLocalities[i].type;

            let localities = [this.listLocalities[i]];

            this._api.addLocalitiesToEvent(JSON.stringify(localities), event ).subscribe(resp => {
              if (resp.status === 200) {
                console.log(resp);
              }
            });
          }else{
            console.log("Hubo error");
          }
        });
      }else{
        let body = {
          event: event,
          rows: this.listLocalities[i].rows,
          cols: this.listLocalities[i].cols
        }

        this._api.generateTickets(body).subscribe(resp => {
          if (resp.status === 200) {
            this.tickets = resp.body['ticket'];
            this.listLocalities[i].tickets = this.tickets;
            
            delete this.listLocalities[i].rows;
            delete this.listLocalities[i].cols;
            delete this.listLocalities[i].quantity;
            delete this.listLocalities[i].hide;
            delete this.listLocalities[i].type;

            let localities = [this.listLocalities[i]]
            
            this._api.addLocalitiesToEvent(JSON.stringify(localities), event ).subscribe(resp => {
              if (resp.status === 200) {
                console.log(resp);
              }
            });
          }else{
            console.log("Hubo error");
          }
        });
      }
    }
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

	onSelect(event) {
		this.files[0] = (event.addedFiles);

    this.filesControl = new FormControl(this.files[0], FileUploadValidators.filesLimit(1));
    
    this.imgFormGroup = this._formBuilder.group({
      img: [this.filesControl],
      imgName: ['tiene valor']
    });
	}

	onRemove(event) {
		this.files.splice(this.files.indexOf(event), 1);
    this.filesControl = new FormControl('', FileUploadValidators.filesLimit(1));
    
    this.imgFormGroup = this._formBuilder.group({
      img: [this.filesControl],
      imgName: ['']
    });
	}

	onSelectAdv(event) {
    if (this.filesAdv.length >= 4) {
      alert("No se puede agregar mas imagenes");
    }else{
      this.filesAdv.push(event.addedFiles);

      this.filesAdvControl = new FormControl(this.filesAdv, FileUploadValidators.filesLimit(4));
      
      this.imgAdvFormGroup = this._formBuilder.group({
        img: [this.filesAdvControl],
        imgName: ['tiene valor']
      });
      
    }
	}

	onRemoveAdv(event) {
		console.log(event);
		this.filesAdv.splice(this.filesAdv.indexOf(event), 1);
	}

  //Atributos categoryFormGroup
  get categoria() {
    return this.categoryFormGroup.get('categoria');
  }

  //Atributos eventFormGroup
  get nameEvent() {
    return this.eventFormGroup.get('nameEvent');
  }

  get date() {
    return this.eventFormGroup.get('date');
  }

  get description() {
    return this.eventFormGroup.get('description');
  }

  get startTime() {
    return this.eventFormGroup.get('startTime');
  }

  get city() {
    return this.eventFormGroup.get('city');
  }

  get endTime() {
    return this.eventFormGroup.get('endTime');
  }

  get place() {
    return this.eventFormGroup.get('place');
  }

  get isAllPublic() {
    return this.eventFormGroup.get('isAllPublic');
  }

  //Atributos priceFormGroup
  get isFree() {
    return this.priceFormGroup.get('isFree');
  }

  get ageChildren() {
    return this.priceFormGroup.get('ageChildren');
  }

  get discountDisability() {
    return this.priceFormGroup.get('discountDisability');
  }

  get discountChildren() {
    return this.priceFormGroup.get('discountChildren');
  }

  get percentageChildren() {
    return this.priceFormGroup.get('percentageChildren');
  }

  get percentageDisability() {
    return this.priceFormGroup.get('percentageDisability');
  }

  //Atributos extraFormGroup
  get openingHours() {
    return this.extraFormGroup.get('openingHours');
  }

  get hasParking() {
    return this.extraFormGroup.get('hasParking');
  }

  get existRequirements() {
    return this.extraFormGroup.get('existRequirements');
  }

  get requirementsDescription() {
    return this.extraFormGroup.get('requirementsDescription');
  }

  get parkingNumber() {
    return this.extraFormGroup.get('parkingNumber');
  }

  //Atributos mapFormGroup
  get lat() {
    return this.mapFormGroup.get('lat');
  }
  
  get lng() {
    return this.mapFormGroup.get('lng');
  }

  //Atributos imgFormGroup
  get img() {
    return this.imgFormGroup.get('img');
  }

  get imgName() {
    return this.imgFormGroup.get('imgName');
  }

  saveLocalities(){
    const description = this.newLocalities.get('description').value;
    const price = Number(this.newLocalities.get('price').value);
    const type = this.newLocalities.get('type').value;
    const quantity = Number(this.newLocalities.get('quantity').value) || 0;
    const rows = this.newLocalities.get('rows').value || 0;
    const cols = this.newLocalities.get('cols').value || 0;

    if (type == "Secuencial") {
      const stock = Number(quantity);
      const amount = Number(quantity);
      this.localities = new Localidades(description, price, amount, stock, type, quantity, null, null);
    }else{
      const stock = Number(rows) * Number(cols);
      const amount = Number(rows) * Number(cols);
      this.localities = new Localidades(description, price, amount, stock, type, null, rows, cols);
    }

    this.enviarLocalidad.emit(this.localities);
    this.listLocalities.push(this.localities);

    this.reset();
  }

  clean(obj) {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }

  reset() {
    this.newLocalities.reset();
  }

  deleteLocalities(index){
    this.listLocalities.splice(index, 1);
  }
}

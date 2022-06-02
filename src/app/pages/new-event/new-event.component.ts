import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import * as mapboxgl from 'mapbox-gl';
import * as moment from 'moment';
import { Localidades } from 'src/app/models/Localidades';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MapCardComponent } from '../../components/map-card/map-card.component';
import { URL_SERVICES } from '../../configurations/url.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit {
  category = "";
  active: string[] = [];
  organizer = localStorage.getItem('idOrganizer');;
  title="";

  categories: any[] = [
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
  
  categoryFormGroup: FormGroup;
  eventFormGroup: FormGroup;
  extraFormGroup: FormGroup;
  imgFormGroup: FormGroup;
  imgAdvFormGroup: FormGroup;
  mapFormGroup: FormGroup;
  priceFormGroup: FormGroup;
  newLocalities: FormGroup;
  selectLocality;

  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(1));
  private filesAdvControl = new FormControl(null, FileUploadValidators.filesLimit(1));

  files: File[] = [];
  filesAdv: File[] = [];

  url = URL_SERVICES;
  imgTemp = "";
  event = new FormData();
  eventAdv = new FormData();

  coordinates;
  
  cont: any[] = [];

  localities: Localidades;
  listLocalities: Localidades[] = [];
  putLocalities: Localidades[] = [];

  tickets: any[] = [];

  idEvt;
  eventData;
  loadPut = false;
  loading = false;

  latE: any = null;
  lngE: any = null;

  @Output() enviarLocalidad = new EventEmitter<Localidades>();


  message: string;
  
  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    public _toastr: ToastrService,
    public route: ActivatedRoute,
    private router: Router,
  ) {
    this.idEvt = this.route.snapshot.paramMap.get("idEvent");
    setTimeout(() => {
      if (this.idEvt) {
        this.createFromEdit(this.idEvt);
        this.title = "Editar Evento";
      }else{
        this.createFrom();
        this.title = "Agregar Evento";
        
        for (let i = 0; i < this.categories.length; i++) {
          this.active[i] = 'inactive';
        }
      }
      
    }, 250);
  }

  ngOnInit() {}

  receiveMessage($event) {
    this.message = $event
  }

  createFrom(){



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
      iva: [''],
    });

    this.extraFormGroup = this._formBuilder.group({
      openingHours: ['', [Validators.required]],
      hasParking: ['', [Validators.required]],
      existRequirements: ['', [Validators.required]],
      requirementsDescription: [''],
      parkingNumber: [''],
      iva: ['']
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

  createFromEdit(idEvt){
    this._api.getEventById(idEvt).subscribe(resp => {
      this.eventData = resp.body['eventDB'];

      this.latE = this.eventData.lat;
      this.lngE = this.eventData.lng;

      this.categoryFormGroup = this._formBuilder.group({
        categoria: ['', [Validators.required, Validators.minLength(1)]]
      });
      
      this.newLocalities = this._formBuilder.group({
        description: ['', [Validators.required]],
        price: ['', [Validators.required]],
        type: ['', [Validators.required]],
        quantity:  ['', [Validators.required]],
      }); 

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
        isAllPublic: [this.eventData.isAllPublic.toString(), [Validators.required]],
      });

      this.priceFormGroup = this._formBuilder.group({
        isFree: [this.eventData.isFree.toString(), [Validators.required]],
        ageChildren: [this.eventData.ageChildren],
        discountDisability: [this.eventData.discountDisability],
        discountChildren: [this.eventData.discountChildren.toString()],
        percentageChildren: [this.eventData.percentageChildren],
        percentageDisability: [this.eventData.percentageDisability],
      });

      this.extraFormGroup = this._formBuilder.group({
        openingHours: [this.eventData.openingHours, [Validators.required]],
        hasParking: [this.eventData.hasParking.toString(), [Validators.required]],
        existRequirements: [this.eventData.existRequirements.toString(), [Validators.required]],
        requirementsDescription: [this.eventData.requirementsDescription],
        parkingNumber: [this.eventData.parkingNumber],
        iva: [this.eventData.iva]
      });

      this.mapFormGroup = this._formBuilder.group({
        lat: [this.eventData.lat, [Validators.required]],
        lng: [this.eventData.lng, [Validators.required]],
      });

      this.imgTemp = this.url + "view/event/" + this.eventData.img;
      
      if (this.priceFormGroup.value.isFree == 'false') {
        for (let i = 0; i < this.eventData.localities.length; i++) {
          if (this.idEvt) {
            this.newLocalities = this._formBuilder.group({
              description: [this.eventData.localities[i].description, [Validators.required]],
              price: [this.eventData.localities[i].price, [Validators.required]],
              type: ['Secuencial', [Validators.required]],
              quantity:  [this.eventData.localities[i].amount, [Validators.required]],
            });
          }else{
            this.newLocalities = this._formBuilder.group({
              description: [this.eventData.localities[i].description, [Validators.required]],
              price: [this.eventData.localities[i].price, [Validators.required]],
              type: [this.eventData.localities[i].type, [Validators.required]],
              quantity:  [this.eventData.localities[i].amount, [Validators.required]],
            }); 
          }
          this.saveLocalities("add");
        }
      }
    });
  }

  getCategories(){
      for (let i = 0; i < this.categories.length; i++) {
        this.active[i] = 'inactive';
      }
  }

  validarCampoLngLat(evt){
    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;
  
    if(code==45) { // signo menos.
      return true;
    }else if(code==46){
      return true;
    } else if(code>=48 && code<=57) { // is a number.
      return true;
    } else{ // other keys.
      this.showAlert('error', 'Error', 'Debe ingresar solo números ó utilizar punto(.) para decimales', 'btn btn-secondary')
      return false;
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

  putEvent(){
    console.log(this.listLocalities);
  }

  postEvent(){
    this.loading = true;
    const fecha = moment(this.eventFormGroup.value.date).format('YYYY-MM-DD');
    const startTimeA = this.eventFormGroup.value.startTime;
    const endTimeA = this.eventFormGroup.value.endTime;

    const startDate = fecha+"T"+startTimeA+":00.000Z";
    const endDate = fecha+"T"+endTimeA+":00.000Z";

    console.log(this.priceFormGroup.value.isFree);

    if (this.priceFormGroup.value.isFree == true || this.priceFormGroup.value.isFree == "true"){
      this.priceFormGroup.value.discountChildren = false;
      this.priceFormGroup.value.percentageChildren = 0;
      this.priceFormGroup.value.discountDisability = false;
      this.priceFormGroup.value.percentageDisability = 0;
      this.priceFormGroup.value.ageChildren = '0';
      this.priceFormGroup.value.iva =  false;
      this.priceFormGroup.value.valueIva = 0;
      this.priceFormGroup.value.isFree = true;
    }else{
      if(this.priceFormGroup.value.iva === 'true' || this.priceFormGroup.value.iva === true){
        this.priceFormGroup.value.valueIva = 12;
      }else{
        this.priceFormGroup.value.valueIva = 0;
      }

      if (this.priceFormGroup.value.discountChildren == 'false' || this.priceFormGroup.value.discountChildren == false) {
        this.priceFormGroup.value.percentageChildren = 0;
      }
  
      if (this.priceFormGroup.value.discountDisability == 'false' || this.priceFormGroup.value.discountDisability == false) {
        this.priceFormGroup.value.percentageDisability = 0;
      }
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
    this.event.append('iva', this.priceFormGroup.value.iva);
    this.event.append('valueIva', this.priceFormGroup.value.valueIva);
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
        if (this.priceFormGroup.value.isFree === true || this.priceFormGroup.value.isFree === 'true') {
          this.eventCreateAlert('success', 'Correcto', 'Se ha creado correctamente el evento', 'btn btn-primary');
        }else{
          this.generateLocalities(resp.body['event']._id);
        }
      }
    });
    
  }

  postAdvertising(idEvent){
    for (let i = 0; i < this.filesAdv.length; i++) {
      this.eventAdv.append('advertising', this.filesAdv[i][0]);
      this.eventAdv.append('event', idEvent);
        
      this._api.postAdvertising(this.eventAdv).subscribe(resp => {
        console.log(resp);
      });
    }
    // this.imgAdvFormGroup 
  }

  generateLocalities(event){
    let cont = 0;

    for (let i = 0; i < this.listLocalities.length; i++) {
      if (this.listLocalities[i].newRecord == 'true') {
        if (this.listLocalities[i].typeNumbering == 'Secuencial') {
          let body = {
            description: this.listLocalities[i].description,
            typeNumbering: this.listLocalities[i].typeNumbering,
            amount: this.listLocalities[i].amount,
            price: this.listLocalities[i].price,
            stock: this.listLocalities[i].stock,
            event: event,
          }
          
          this._api.postLocalities(body).subscribe(resp => {
            console.log(resp);
            if (resp.status === 200) {
              cont = cont + 1;

              if(cont ===  this.listLocalities.length){
                this.eventCreateAlert('success', 'Correcto', 'Se ha creado correctamente el evento', 'btn btn-primary');
              }
            }
          });

          // this._api.generateTickets(body).subscribe(resp => {
          //   if (resp.status === 200) {
          //     this.tickets = resp.body['ticket'];
          //     this.listLocalities[i].tickets = this.tickets;
  
          //     delete this.listLocalities[i].rows;
          //     delete this.listLocalities[i].cols;
          //     delete this.listLocalities[i].quantity;
          //     delete this.listLocalities[i].hide;
          //     delete this.listLocalities[i].newRecord;
  
          //     let localities = [this.listLocalities[i]];
  
          //     this._api.addLocalitiesToEvent(JSON.stringify(localities), event ).subscribe(resp => {
          //       if (resp.status === 200) {
          //         cont = cont + 1;
  
          //         if(cont ===  this.listLocalities.length){
          //           this.eventCreateAlert('success', 'Correcto', 'Se ha creado correctamente el evento', 'btn btn-primary');
          //         }
          //       }
          //     });
          //   }else{
          //     this.showAlert('error', 'Error', 'Algo ha salido mal', 'btn btn-default');
          //     return;
          //   }
          // });
        }
      }
    }
  }

  // generateTicket(event){
  //   let cont = 0;

  //   for (let i = 0; i < this.listLocalities.length; i++) {
  //     if (this.listLocalities[i].newRecord == 'true') {
  //       if (this.listLocalities[i].typeNumbering == 'Secuencial') {
  //         let body = {
  //           event: event,
  //           quantity: this.listLocalities[i].amount,
  //         }
  
  //         this._api.generateTickets(body).subscribe(resp => {
  //           if (resp.status === 200) {
  //             this.tickets = resp.body['ticket'];
  //             this.listLocalities[i].tickets = this.tickets;
  
  //             delete this.listLocalities[i].rows;
  //             delete this.listLocalities[i].cols;
  //             delete this.listLocalities[i].amount;
  //             delete this.listLocalities[i].hide;
  //             delete this.listLocalities[i].newRecord;
  
  //             let localities = [this.listLocalities[i]];
  
  //             this._api.addLocalitiesToEvent(JSON.stringify(localities), event ).subscribe(resp => {
  //               if (resp.status === 200) {
  //                 cont = cont + 1;
  
  //                 if(cont ===  this.listLocalities.length){
  //                   this.eventCreateAlert('success', 'Correcto', 'Se ha creado correctamente el evento', 'btn btn-primary');
  //                 }
  //               }
  //             });
  //           }else{
  //             this.showAlert('error', 'Error', 'Algo ha salido mal', 'btn btn-default');
  //             return;
  //           }
  //         });
  //       }else{
  //         let body = {
  //           event: event,
  //           rows: this.listLocalities[i].rows,
  //           cols: this.listLocalities[i].cols
  //         }
  
  //         this._api.generateTickets(body).subscribe(resp => {
  //           if (resp.status === 200) {
  //             this.tickets = resp.body['ticket'];
  //             this.listLocalities[i].tickets = this.tickets;
               
  //             delete this.listLocalities[i].rows;
  //             delete this.listLocalities[i].cols;
  //             delete this.listLocalities[i].amount;
  //             delete this.listLocalities[i].hide;
  //             delete this.listLocalities[i].typeNumbering;
  //             delete this.listLocalities[i].newRecord;
  
  //             let localities = [this.listLocalities[i]]
              
  //             this._api.addLocalitiesToEvent(JSON.stringify(localities), event ).subscribe(resp => {
  //               if (resp.status === 200) {
  //                 cont = cont + 1;
  
  //                 if(cont ===  this.listLocalities.length){
  //                   this.eventCreateAlert('success', 'Correcto', 'Se ha creado correctamente el evento', 'btn btn-primary');
  //                 }
  //               }
  //             });
  //           }else{
  //             this.showAlert('error', 'Error', 'Algo ha salido mal', 'btn btn-default');
  //             return;
  //           }
  //         });
  //       }
  //     }
  //   }
  // }

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

  eventCreateAlert(type, title, text, classBtn) {
    swal.fire({
      title,
      text,
      type,
      buttonsStyling: false,
      confirmButtonClass: classBtn
    }).then((_) => {
      this.router.navigate(['/event']);
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

  get iva() {
    return this.priceFormGroup.get('iva');
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

  saveLocalities(opt){
    const description = this.newLocalities.get('description').value;
    const price = Number(this.newLocalities.get('price').value);
    const type = this.newLocalities.get('type').value;
    const quantity = Number(this.newLocalities.get('quantity').value) || 0;

    if (type == "Secuencial") {
      const stock = Number(quantity);
      const amount = Number(quantity);
      if (opt === "new") {
        this.localities = new Localidades(description, price, amount, stock, type, 'true', null, null);
      }else{
        this.localities = new Localidades(description, price, amount, stock, type, 'false', null, null);
      }
    }else{
      const rows = this.newLocalities.get('rows').value || 0;
      const cols = this.newLocalities.get('cols').value || 0;
      const stock = Number(rows) * Number(cols);
      const amount = Number(rows) * Number(cols);

      if (opt === "new") {
        this.localities = new Localidades(description, price, amount, stock, type, 'true', rows, cols);
      }else{
        this.localities = new Localidades(description, price, amount, stock, type, 'false', rows, cols);
      }
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

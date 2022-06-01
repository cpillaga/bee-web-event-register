import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Vector from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import { fromLonLat, transform } from 'ol/proj';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html'
})
export class MapCardComponent implements OnInit {

  @ViewChild('mapa', {static: false}) mapa;
  @Input() lat: any;
  @Input() lng: any;
  @Output() coorsEmit: EventEmitter<any> = new EventEmitter();

  map: Map;
  source: any;
  point: any;
  marker: any;
  markerVectorLayer: any;
  tokenMap = 'pk.eyJ1IjoicGxlbWE3MDQiLCJhIjoiY2p4a2o3cmhzMjRleDN0cDZweWJpeWducyJ9.iLAt8_WcAk6ShXSp6FooEg';

  constructor() {  }

  ngOnInit() {
    this.mapLoad();
  }

  mapLoad() {
    setTimeout(() => {
      this.map = new Map({
        target: this.mapa.nativeElement,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${this.tokenMap}`
            })
          })
        ],
        view: new View({
          center: fromLonLat([this.lng, this.lat]),
          zoom: 14,
          maxZoom: 18,
          minZoom: 7
        })
      });
      this.clickMap();
      this.setMarker(transform([this.lng, this.lat], 'EPSG:4326', 'EPSG:3857'));
    }, 50);
  }

  clickMap() {
    this.map.on('click', (event) => {
      if (this.markerVectorLayer !== undefined) {
        this.clearMarker();
      }
      this.setMarker(event.coordinate);
    });
  }

  setMarker(coordinate) {
    const coors = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    this.coorsEmit.emit({
      lat: coors[1],
      lng: coors[0]
    });
    console.log(coordinate);
    this.source = new VectorSource();
    this.point = new Point(coordinate);
    this.marker = new Feature({
      geometry: this.point
    });
    this.marker.setStyle(this.iconStyle());
    this.source.addFeature(this.marker);
    this.markerVectorLayer = new Vector({
      source: this.source,
    });
    this.map.addLayer(this.markerVectorLayer);
  }

  iconStyle() {
    return new Style({
      image: new Icon({
        crossOrigin: 'anonymous',
        anchor: [20, 53],
        anchorXUnits: IconAnchorUnits.PIXELS,
        anchorYUnits: IconAnchorUnits.PIXELS,
        src: `./assets/bee_location.png`
      })
    });
  }

  clearMarker() {
    this.markerVectorLayer.getSource().clear();
  }

}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import H from "@here/maps-api-for-javascript";
import { DataService } from 'src/app/services/data/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.scss']
})
export class HereMapComponent implements OnInit, AfterViewInit {

  private map?: H.Map;

  @ViewChild('map') mapDiv?: ElementRef;

  hotels = new Array<any>();

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getHotels().subscribe(() => {
      this.hotels = this.dataService.hotels;
      let initialPosition: {
        lat: number,
        lng: number
      };
      if (this.hotels && this.hotels.length > 0) {
       initialPosition = {lat: this.hotels[0].position.lat, lng: this.hotels[0].position.lng}
      } else {
        initialPosition = {lat: 0, lng: 0};
      }
      this.setupMap(initialPosition.lat, initialPosition.lng);
      this.hotels.forEach(hotel => {
        this.addHotelMarker(hotel.position.lat, hotel.position.lng);
      });
    });
  }

  addHotelMarker(lat: number, lng: number) {

  // Create a marker icon from an image URL:
  var icon = new H.map.Icon('assets/icons/home-icon.svg');

  // Create a marker using the previously instantiated icon:
  var marker = new H.map.Marker({ lat: lat, lng: lng }, {data: null, icon: icon});

  // Add the marker to the map:
  this.map?.addObject(marker);
  }

  setupMap(lat: number, lng: number) {
    const platform = new H.service.Platform({
      apikey: environment.apiKey
    });
    const layers = platform.createDefaultLayers();
    const map = new H.Map(this.mapDiv?.nativeElement, layers.vector.normal.map,
      {
        pixelRatio: window.devicePixelRatio,
        center: {lat: lat, lng: lng},
        zoom: 15,
      },
    );
    this.map = map;
  }

  ngAfterViewInit() {
  }

}

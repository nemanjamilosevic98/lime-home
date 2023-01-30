import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import H from "@here/maps-api-for-javascript";
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { Hotel } from 'src/app/shared/models/hotel.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.scss']
})
export class HereMapComponent implements OnInit, OnDestroy {

  private map?: H.Map;

  @ViewChild('map') mapDiv?: ElementRef;

  hotels = new Array<any>();
  selectedHotel = 0;

  private readonly onDestroy = new Subject<void>();

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.getHotels()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.hotels = this.dataService.hotels;
        const initialLat = this.hotels && this.hotels.length > 0 ? this.hotels[0].position.lat : 0;
        const initialLng = this.hotels && this.hotels.length > 0 ? this.hotels[0].position.lng : 0;
        this.setupMap(initialLat, initialLng);
        this.hotels.forEach((hotel: Hotel, index: number) => {
          this.addHotelMarker(hotel.position.lat, hotel.position.lng, index);
        });
      });
    this.dataService.getSelectedHotelIndex()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(index => {
        this.selectedHotel = index;
        console.log(this.selectedHotel);
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  addHotelMarker(lat: number, lng: number, index: number) {
    const icon = new H.map.Icon('assets/icons/home-icon.svg');
    const marker = new H.map.Marker({ lat: lat, lng: lng }, {data: index, icon: icon});
    marker.addEventListener('tap', () => {
      this.map?.getObjects().forEach(object=> {
        const currentMarker = (object as H.map.Marker);
        const icon = new H.map.Icon('assets/icons/home-icon' + (marker.getData() == currentMarker.getData() ? '-active' : '') + '.svg');
        currentMarker.setIcon(icon);
      });
      this.dataService.selectedHotelIndex = marker.getData();
    });
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
    // Enable the event system on the map instance:
    var mapEvents = new H.mapevents.MapEvents(this.map);
  }

}

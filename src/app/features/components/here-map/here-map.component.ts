import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import H from "@here/maps-api-for-javascript";
import { Subject, debounce, fromEvent, interval, takeUntil, timer } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { Hotel } from 'src/app/shared/models/hotel.model';
import { environment } from 'src/environments/environment';
import { DEFAULT_MAP_ZOOM, MARKER_ICON, SCROLL_BEHAVIOR_SMOOTH, SLIDER_SCROLL_DEBOUNCE_TIME_MS } from 'src/app/constants/general.constants';

@Component({
  selector: 'app-here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.scss']
})
export class HereMapComponent implements OnInit, OnDestroy, AfterViewInit {

  private map: H.Map;

  @ViewChild('map') mapDiv: ElementRef;

  hotels = new Array<any>();
  selectedHotelIndex = 0;

  @ViewChild('hotelsSlider') hotelsSlider: any;

  private readonly onDestroy = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
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
        timer(200).subscribe(x => {
          fromEvent(this.hotelsSlider.nativeElement, 'scroll')
          .pipe(debounce(() => interval(SLIDER_SCROLL_DEBOUNCE_TIME_MS)))
          .subscribe(() => {
            const cardWidth = (this.hotelsSlider.nativeElement.childNodes[0] as HTMLDivElement).clientWidth;
            this.dataService.selectedHotelIndex = Math.trunc((this.hotelsSlider.nativeElement as HTMLDivElement).scrollLeft/ cardWidth);
            this.refreshMarkerSelection();
            this.refreshSlider(this.dataService.selectedHotelIndex); // positioning scroll to the nearest hotel, for free scroll comment this
          });
        })
      });
    this.dataService.getSelectedHotelIndexAsObs()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(index => {
        this.selectedHotelIndex = index;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  setupMap(lat: number, lng: number) {
    const platform = new H.service.Platform({apikey: environment.apiKey});
    const layers = platform.createDefaultLayers();
    this.map  = new H.Map(this.mapDiv.nativeElement, layers.vector.normal.map,
      {
        pixelRatio: window.devicePixelRatio,
        center: {lat: lat, lng: lng},
        zoom: DEFAULT_MAP_ZOOM,
      });
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map)); // Enable the event system on the map instance:
    const ui = H.ui.UI.createDefault(this.map, layers);
    window.addEventListener('resize', () => this.map.getViewPort().resize());
  }

  addHotelMarker(lat: number, lng: number, index: number) {
    const icon = new H.map.Icon(MARKER_ICON + (index === 0 ? '-active' : '') + '.svg');
    const marker = new H.map.Marker({ lat: lat, lng: lng }, {data: index, icon: icon});
    marker.addEventListener('tap', () => {
      this.dataService.selectedHotelIndex = marker.getData();
      this.refreshMarkerSelection();
      this.refreshSlider(index);
    });
    this.map.addObject(marker);
  }

  refreshMarkerSelection() {
    this.map.getObjects().forEach(object=> {
      const currentMarker = (object as H.map.Marker);
      const icon = new H.map.Icon(MARKER_ICON + (this.selectedHotelIndex == currentMarker.getData() ? '-active' : '') + '.svg');
      currentMarker.setIcon(icon);
      this.map.setCenter({lat: this.hotels[this.selectedHotelIndex].position.lat, lng:this.hotels[this.selectedHotelIndex].position.lng})
    });
  }

  refreshSlider(index: number) {
    const offsetLeft = this.hotelsSlider.nativeElement.childNodes[index*2].offsetLeft;
    this.hotelsSlider.nativeElement.scrollTo({left: offsetLeft, behavior: SCROLL_BEHAVIOR_SMOOTH, inline: 'center', block: 'center'});
  }

  onCardClick(index:number) {
    this.dataService.selectedHotelIndex = index;
    this.refreshMarkerSelection();
    this.refreshSlider(index);
  }
}

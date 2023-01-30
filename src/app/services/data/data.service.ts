import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Hotel } from 'src/app/shared/models/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  hotels: Hotel[] = [];
  private markerSelectedSubject: Subject<number> = new Subject<number>();
  // default location, intersection of equator and prime meridian
  private _selectedHotelIndex = 0;

  get selectedHotelIndex(): number {
    return this._selectedHotelIndex;
  }
  set selectedHotelIndex(index: number) {
    if (this.selectedHotelIndex != index) {
      this._selectedHotelIndex = index;
      this.markerSelectedSubject.next(index);
    }
  }

  constructor(
    private _httpClient: HttpClient
  ) {  }
/*
  queryLocation(query: string) {
    const [latitude, longitude] = this._currentLocation;
    const params = new HttpParams();
    params.append('at', `${latitude},${longitude}`);
    params.append('q', query);
    params.append('apiKey', environment.apiKey);
    return this._httpClient.get(`https://discover.search.hereapi.com/v1/discover?apiKey=${environment.apiKey}&at=${latitude},${longitude}&q=${query}`)
      .pipe(
        tap(
          ({ items }: any) => {
            this.hotels = items.map(
              (item: any) => {
                item.price = Math.round((Math.random() * 100) + 1);
                return item;
              }
            );
          }
        ),
        catchError(
          () => {
            this.hotels = [];
            return of([]);
          }
        )
      );
  }*/

  getHotels(): Observable<{}>{
    return this._httpClient.get('/api/hotels').pipe(
      tap(
        (response: any) => {
          this.hotels = response.items;
          console.log('hotels', this.hotels);
        }
      ), catchError(
      (err) => {
        console.log(err);
        this.hotels = [];
        return of([]);
      }
    ));
  }

  getSelectedHotelIndex() : Observable<number> {
    return this.markerSelectedSubject.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HOTELS_URL } from 'src/app/constants/general.constants';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  hotels: any[] = [];
  private markerSelectedSubject: Subject<number> = new Subject<number>();
  private _selectedHotelIndex = 0;

  constructor(
    private _httpClient: HttpClient
  ) {  }

  getHotels(): Observable<{}>{
    // const url = '/api/hotels'; // proxy solution forlocal
    const url = HOTELS_URL;
    return this._httpClient.get(url).pipe(
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

  getSelectedHotelIndexAsObs() : Observable<number> {
    return this.markerSelectedSubject.asObservable();
  }

  get selectedHotelIndex(): number {
    return this._selectedHotelIndex;
  }
  set selectedHotelIndex(index: number) {
    if (this.selectedHotelIndex != index) {
      this._selectedHotelIndex = index;
      this.markerSelectedSubject.next(index);
    }
  }

}

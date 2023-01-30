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
  private _selectedHotelIndex = 0;

  constructor(
    private _httpClient: HttpClient
  ) {  }

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
